
import {Base, Initializing} from "badman-core";
import {Logger} from "log4js";
import {Server} from "socket.io";
import {RemoteSocket} from "socket.io/dist/broadcast-operator";
import {Socket} from "socket.io/dist/socket";
import ReadStatus from "../entity/ReadStatus";
import TalkAbout from "../entity/TalkAbout";
import DefaultNewsSendingStrategy from "../strategy/DefaultNewsSendingStrategy";
import NewsSendingStrategy from "../strategy/NewsSendingStrategy";
import ChatServerProperties from "./ChatServerProperties";
import Http from "http";
import type { Server as HTTPSServer } from "https";
import type { Http2SecureServer } from "http2";



// socket.on("disconnecting", (reason) => {
// 	this.logger.info('-----------------disconnecting---------------------',reason,'\r\n');
// });

// console.log("initial transport", socket.conn.transport.name); // prints "polling"
//
// socket.conn.once("upgrade", () => {
// 	// called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
// 	console.log("upgraded transport", socket.conn.transport.name); // prints "websocket"
// 	this.logger.info(`${socket.id}-----------------upgrade------------------`);
// });
//
// socket.conn.on("packet", ({ type, data }) => {
// 	// called for each packet received
// });
//
// socket.conn.on("packetCreate", ({ type, data }) => {
// 	// called for each packet sent
// });
//
// socket.conn.on("drain", () => {
// 	// called when the write buffer is drained
// });
//

//中转站 transfer station
export default class ChatServer<News extends TalkAbout = TalkAbout> implements Initializing{

	private readonly logger:Logger
	private readonly server:Server;
	private readonly defaultWelcomeMessage:string = '·Welcome to Badman·';
	private properties:Partial<ChatServerProperties>;

	private newsSendingStrategy:NewsSendingStrategy<News>;

	private readonly defaultNewsSendingStrategy:DefaultNewsSendingStrategy;

	private closed:boolean = true;

	constructor (properties:Partial<ChatServerProperties>,logger:Logger,heart?:Http.Server | HTTPSServer | Http2SecureServer) {
		this.logger = logger;
		this.properties = properties;
		this.defaultNewsSendingStrategy = new DefaultNewsSendingStrategy(logger);
		this.server = new Server(heart || properties.port,properties);
		this.closed = false;
		this.server.on("connection_error", (err) => {
			this.logger.error('Error->',err);
		});
	}

	setNewsSendingStrategy(newsSendingStrategy:NewsSendingStrategy<any>){
		this.newsSendingStrategy = newsSendingStrategy;
	}

	async afterInitialized (): Promise<void> {

		// '/' is  default path
		//socket就是一个普通对象 包含了客户端 和 服务端
		//connection alias for connect
		this.server.of('/').on('connect',async (connection:Socket)=>{

			//see https://socket.io/docs/v4/server-api/#socket
			// socket.on("disconnect", (reason) => {
			// 	this.logger.info(socket.handshake.query.name,'-------disconnect--------',reason,'\r\n');
			// 	//this.logger.info('-------disconnect--------',socket);
			// });
			//
			// socket.conn.on("close", (reason) => {
			// 	// called when the underlying connection is closed
			// 	this.logger.info('------------socket.conn.close---------------->',reason);
			// });

			let clientParam = connection.handshake.query;
			let clientName:string = clientParam.name.toString();
			this.logger.info(`The server receive connection‘s of the client[${clientName}]`);
			if(!connection.data.clientName){
				connection.data.clientName = clientName;
			}
			let isExisted:boolean = await this.isExist(clientName);
			if(isExisted){
				connection.emit('loginRepeatedly',clientName);
				this.logger.warn('Repeat login,then emit loginRepeatedly event, and compulsory withdrawal after 2s...');
				await Base.sleep(2000,()=>{
					connection.disconnect(true);
					this.logger.warn('Server has Closed Repeatable login ...');
				})
				return;
			}

			connection.join(clientName);
			this.logger.debug(`The server modify newly the client[${clientName}] ’s roomId,but not delete the client‘s sid `);
			//提示连接服务端并登录成功
			connection.emit('connect_login',
				{  success:true,
					msg:`${this.properties.welcomeMessage?this.properties.welcomeMessage:this.defaultWelcomeMessage}(${clientName})`,
					id:connection.id}
			);
			this.logger.debug(`The server emit[connect_login] to the client[${clientName}] has connected completely`);

			// 监听客户端talk事件并匹配接受者（个人、群体）
			connection.on('talkTo', async (talkAbout:News) => {
				this.logger.debug(`The server listened talkTo event from the client[${clientParam.name}]`);
				let strategy:NewsSendingStrategy<News> = <NewsSendingStrategy<News>>(this.newsSendingStrategy?this.newsSendingStrategy:this.defaultNewsSendingStrategy);
				await strategy.preSending(connection,talkAbout);
				await strategy.postSending(connection,talkAbout);
				await strategy.afterSending(connection,talkAbout);
				this.logger.debug(`The server use strategy[${strategy.strategyName()}] to handle the client[${clientName}] to exec [pre post after] method completely`);
			});

			//加入群聊
			connection.on('joinRoom',(...roomIds)=>{
				this.joinRoom(connection,roomIds);
				this.logger.debug(`${connection.data.clientName } has joined all room [${roomIds.join(',')}]`);
			});

			//退出群聊
			connection.on('leaveRoom',async (closeUnderlyingConnection:boolean,...roomIds:string[])=>{
				if(closeUnderlyingConnection){
					roomIds = Array.from(connection.rooms);
					//自动退出当前room
					connection.disconnect(closeUnderlyingConnection);
					this.logger.debug(`${connection.data.clientName } has chose to leave room by close underlying connection`);
				}else{
					if(roomIds){
						await this.leaveJoinRoom(connection,roomIds);
					}
				}
				this.logger.debug(`${connection.data.clientName } has leaved all rooms [${roomIds.join(',')}]`,'\r\n');
			});

			//通知发送者，谁已经读了消息
			connection.on('readMessages',(messageStatuses:ReadStatus[])=>{

				for (let i = 0; i < messageStatuses.length; i++) {
					let readStatus:ReadStatus = messageStatuses[i];
					connection.to(readStatus.sender).emit('read',readStatus);
					this.logger.debug(`The server has emitted READ event that news is [${readStatus.newsId}] of room[${readStatus.roomId}] to the client[${readStatus.sender}] by the client [${connection.data.clientName}]`);
				}
				let strategy:NewsSendingStrategy<any> = this.newsSendingStrategy?this.newsSendingStrategy:this.defaultNewsSendingStrategy;
				strategy.afterRead(messageStatuses);
				this.logger.debug(`The server use strategy[${strategy.strategyName()}] to handle the client[${clientName}] afterRead() completely`);

			});

		});
	}

	/**
	 * Get the connection by roomId(maybe)
	 * @param roomIds
	 */
	async getSockets(...roomIds:string[]):Promise<RemoteSocket<any,any>[]>{
		let sockets: RemoteSocket<any,any>[] = [];
		if(roomIds && roomIds.length>0){
			sockets = await this.server.in(roomIds).fetchSockets();
		}else {
			sockets = await this.server.fetchSockets();
		}
		return sockets;
	}

	/**
	 * Is client in the room
	 * @param clientName
	 * @param roomIds
	 */
	async isExist(clientName:string,...roomIds:string[]):Promise<boolean>{
		let sockets:RemoteSocket<any,any>[] = await this.getSockets(...roomIds);
		let first:boolean = true;
		let socket:RemoteSocket<any,any> = sockets.find((socket:RemoteSocket<any,any>) => {
			if(socket.data.clientName === clientName){
				if(first){
					first = false;
				}else{
					return socket;
				}
			}
		});
		let isExist:boolean = false;
		let allRoomId:string[] = roomIds;
		if(socket){
			isExist = true;
			let inMemory:string[] = Array.from<string>(socket.rooms);
			allRoomId.push(...inMemory);
		}
		this.logger.warn('The client[%s]  %s  in the room[%s]',clientName,isExist?'is':'is not',allRoomId.join(','));
		return isExist;
	}

	/**
	 * Get current room's members
	 * @param excluding
	 * @param roomIds
	 */
	async getReceives(excluding:string,...roomIds:string[]):Promise<string[]>{

		let sockets:RemoteSocket<any,any>[] = await this.getSockets(...roomIds);
		let receives:string[] = sockets.map((socket:RemoteSocket<any,any>,index:number)=>{
			if(excluding && excluding !== socket.data.clientName){
				return `${socket.data.clientName}[${socket.id}]`;
			}else{
				return `${socket.data.clientName}[${socket.id}]`;
			}
		});
		return receives;
	}

	async getReceivesGroupByRoomId():Promise<any>{

		let sockets: RemoteSocket<any,any>[] = await this.server.fetchSockets();

		if(!sockets || sockets.length<=0){
			return null;
		}
		let group:any = {};
		sockets.forEach((socket:RemoteSocket<any,any>)=>{
			let client:string = `${socket.data.clientName}[${socket.id}]`;
			socket.rooms.forEach(value => {
				if(group[value]){
					group[value].push(client);
				}else{
					group[value]=[client];
				}
			});
		})
		return group;
	}



	private async joinRoom(connection:Socket,...roomIds){
		if(roomIds && roomIds.length>0){
			for (let i = 0; i < roomIds.length; i++) {
				await connection.join(roomIds[i]);
				this.logger.debug(`${connection.data.clientName } has joined the room [${roomIds[i]}]`);
			}
		}
	}

	private async leaveJoinRoom(connection:Socket,...roomIds){
		if(roomIds && roomIds.length>0){
			for (let i = 0; i < roomIds.length; i++) {
				await connection.leave(roomIds[i]);
				this.logger.debug(`${connection.data.clientName } has leaved the room [${roomIds[i]}]`);
			}
		}
	}

	isClosed():boolean{
		return this.closed;
	}

	async close(){
		this.logger.debug('Closing ChatServer.....');
		this.server.close(()=>{
			this.closed = true;
		});
		while (!this.closed){
			await Base.sleep(2000,()=>{
				this.logger.debug('Waiting Close ChatServer.....');
			});
		}
		this.logger.debug('Closing ChatServer successfully.....');
	}
}