
import {Initializing} from "badman-core";
import {Logger} from "log4js";
import {Server} from "socket.io";
import {RemoteSocket} from "socket.io/dist/broadcast-operator";
import {Socket} from "socket.io/dist/socket";
import ReadStatus from "../entity/ReadStatus";
import TalkAbout, {Copy} from "../entity/TalkAbout";
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
export default class ChatServer implements Initializing{

	private readonly logger:Logger
	private readonly server:Server;
	private readonly defaultWelcomeMessage:string = '·欢迎光临红浪漫,宾上客一位·';
	private properties:Partial<ChatServerProperties>;

	private newsSendingStrategy:NewsSendingStrategy<any>;

	private readonly defaultNewsSendingStrategy:NewsSendingStrategy<any>;

	constructor (properties:Partial<ChatServerProperties>,logger:Logger,heart?:Http.Server | HTTPSServer | Http2SecureServer) {
		this.logger = logger;
		this.properties = properties;
		this.defaultNewsSendingStrategy = new DefaultNewsSendingStrategy(logger);
		this.server = new Server(heart || properties.port,properties)
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
		this.server.of('/').on('connect',(connection:Socket)=>{

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

			if(!connection.data.clientName){
				connection.data.clientName = clientParam.name;
			}

			let customClientId:string = clientParam.name.toString();
			if(!connection.rooms.has(customClientId)){
				connection.join(customClientId);
				//提示连接服务端并登录成功
				connection.emit('connect_login',
					{  success:true,
						msg:`${this.properties.welcomeMessage?this.properties.welcomeMessage:this.defaultWelcomeMessage}(${customClientId})`,
						id:connection.id}
				);
				// 监听客户端talk事件并匹配接受者（个人、群体）
				connection.on('talkTo', async (talkAbout) => {
					let news:TalkAbout = Copy(talkAbout);
					let strategy:NewsSendingStrategy<any> = this.newsSendingStrategy?this.newsSendingStrategy:this.defaultNewsSendingStrategy;
					let preSendingResult = await strategy.preSending(news);
					await strategy.postSending(connection,news,preSendingResult);
					strategy.afterSending(connection,news);
				});

				//加入群聊
				connection.on('joinRoom',(...roomIds)=>{
					this.joinRoom(connection,roomIds);
					this.logger.info(`${connection.data.clientName } 加入群聊 [${roomIds.join(',')}]`,'\r\n');
				});

				//退出群聊
				connection.on('leaveRoom',async (closeUnderlyingConnection:boolean,...roomIds:string[])=>{
					if(closeUnderlyingConnection){
						roomIds = Array.from(connection.rooms);
						//自动退出当前room
						connection.disconnect(closeUnderlyingConnection);
					}else{
						if(roomIds){
							await this.leaveJoinRoom(connection,roomIds);
						}
					}
					this.logger.info(`${connection.data.clientName } 退出群聊 [${roomIds.join(',')}]`,'\r\n');
				});

				//通知发送者，谁已经读了消息
				connection.on('readMessages',(messageStatuses:ReadStatus[])=>{

					for (let i = 0; i < messageStatuses.length; i++) {
						let readStatus:ReadStatus = messageStatuses[i];
						connection.to(readStatus.sender).emit('read',messageStatuses);
					}

				});
			}else{
				this.logger.error('Repeat Longin');
				connection.emit('reLogin',clientParam);
				//connection.disconnect(true);
			}

		});
	}

	/**
	 * 获取聊天室成员
	 * @param excluding 不包含
	 * @param roomIds 聊天室
	 */
	async getReceives(excluding:string,...roomIds):Promise<string[]>{

		let sockets: RemoteSocket<any,any>[] = [];
		if(roomIds && roomIds.length>0){
			sockets = await this.server.in(roomIds).fetchSockets();
		}else {
			sockets = await this.server.fetchSockets();
		}

		let receives:string[] = sockets.map((socket:RemoteSocket<any,any>,index)=>{
			if(excluding && excluding !== socket.data.clientName){
				return socket.data.clientName;
			}else{
				return socket.data.clientName;
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
		sockets.forEach((socket:RemoteSocket<any,any>,index)=>{
			let client:string = socket.data.clientName;
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


	//加入群聊
	private async joinRoom(connection:Socket,...roomIds){
		if(roomIds && roomIds.length>0){
			for (let i = 0; i < roomIds.length; i++) {
				await connection.join(roomIds[i]);
			}
		}
	}

	private async leaveJoinRoom(connection:Socket,...roomIds){
		if(roomIds && roomIds.length>0){
			for (let i = 0; i < roomIds.length; i++) {
				await connection.leave(roomIds[i]);
			}
		}
	}

}