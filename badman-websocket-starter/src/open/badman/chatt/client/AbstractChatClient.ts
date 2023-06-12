
import {Initializing} from "badman-core";
import {Logger} from "log4js";
import {io, Socket} from "socket.io-client";
import ReadStatus from "../entity/ReadStatus";
import SentStatus from "../entity/SentStatus";
import TalkAbout, {Copy} from "../entity/TalkAbout";
import OfflineError from "../error/OfflineError";
import ChatClientProperties from "./ChatClientProperties";

// const engine = this.client.io.engine;
// this.logger.info('engine.transport.name--------->',engine.transport.name); // in most cases, prints "polling"

// engine.once("upgrade", () => {
// 	// called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
// 	this.logger.info('upgrade-->',engine.transport.name); // in most cases, prints "websocket"
// });
//
// engine.on("packet", (a:Packet) => {
// 	// called for each packet received
// 	this.logger.info('packet-->',a.type);
// 	this.logger.info('packet-->',a.data);
// 	this.logger.info('packet-->',a.options);
// });
//
// engine.on("packetCreate", (a:Packet) => {
// 	// called for each packet sent
// 	this.logger.info('packetCreate-->',a.type);
// 	this.logger.info('packetCreate-->',a.data);
// 	this.logger.info('packetCreate-->',a.options);
// });
//
// engine.on("drain", () => {
// 	// called when the write buffer is drained
// 	this.logger.info('drain-->');
// });
//
// this.client.io.on("reconnect_attempt", (attempt) => {
// 	// ...
// 	this.logger.info(this.client.io.reconnectionAttempts(),'reconnect_attempt->',attempt,'\r\n');
// });

/**
 * 每个用户都只有 1个 客户端, 内部包含着所有的 群、好友.
 */
export default abstract class AbstractChatClient<TalkingType> implements Initializing{


	protected readonly logger:Logger;

	/**
	 *  important! for receiving or sending personal message
	 */
	protected readonly clientName:string;

	//the connection
	protected readonly client:Socket;

	private connected:boolean;


	/**
	 *  all chatgroups (chatRoom)
	 * @protected
	 */
	private readonly roomIds:Map<string,string>;



	// this.client.on('connect_error',async (err: Error)=>{
	// 	let prefix = `${this.clientName}·连接失败 state = ${this.client.connected}\r\n`;
	// 	this.logger.error(prefix,err);
	// });
	//
	// this.client.on("disconnect", (reason: Socket.DisconnectReason, description?: DisconnectDescription) => {
	//
	// 	this.logger.error(`${this.clientName}·断开连接成功 state = ${this.client.connected}\r\n`);
	// });
	protected constructor (clientName:string,server:string,logger:Logger,customProperties?:Partial<ChatClientProperties>) {
		this.logger = logger;
		if(!clientName){
			throw new Error('clientName can not be null');
		}
		this.clientName = clientName;

		this.roomIds = new Map<string, string>();

		let properties:Partial<ChatClientProperties> = {
			query: {"name": this.clientName}
		};

		if(customProperties){
			Object.assign(properties,customProperties);
		}

		this.client = io(server,properties);

		//登录成功
		this.client.on('connect_login',msg => {
			this.onLogin(msg);
		});

		this.client.on('connect',async ()=>{
			if(!this.connected){
				//防止重连后 调用多次afterInitialized()
				this.connected=true;
				await this.afterInitialized();
				this.logger.info(`${this.clientName}·连接成功`,'\r\n');
			}else{
				this.logger.info(`${this.clientName}·重连接成功`,'\r\n');
			}
		});

	}


	// const engine = this.client.io.engine;
	// engine.on("close", (reason:string) => {
	// 	// called when the underlying connection is closed
	// 	this.logger.info('close-->');
	// });
	//
	// //Please note that since Socket.IO v3, the Socket instance does not emit any event related to the reconnection logic anymore.
	// // You can listen to the events on the Manager instance directly:
	// this.client.io.on("reconnect", (a:number) => {
	// 	// ...
	// 	this.logger.error('reconnect--> ',a);
	// });
	//
	// this.client.io.on("reconnect_failed", () => {
	// 	// ...
	// 	this.logger.error('reconnect_failed--> ');
	// });
	//
	// this.client.io.on("reconnect_error", (error) => {
	// 	// ...
	// 	this.logger.error('reconnect_error--> ',error);
	// });
	async afterInitialized (): Promise<void> {

		//接收消息
		this.client.on('receiveFrom',(message:TalkingType) => {
			this.onReceive(message);
		});

		//通知发送方,谁已读消息
		this.client.on('read',(messageStatus:ReadStatus)=>{
			this.onRead(messageStatus);
		});

		//通知消息已发送
		this.client.on('sent',(sentStatus:SentStatus)=>{
			this.onSent(sentStatus);
		});


	}

	/**
	 * receiving a piece of message tip
	 * @param talking
	 */
	abstract onReceive(talking:TalkingType);

	/**
	 * emitted when the other clients read
	 * @param messageStatuses
	 */
	abstract onRead(messageStatuses:ReadStatus);

	/**
	 * emitted when the server sent
	 * @param sentStatus
	 */
	abstract onSent (sentStatus: SentStatus);

	/**
	 * emitted when the server connection response
	 * @param msg
	 */
	abstract onLogin(msg:{success,msg});

	/**
	 * the current connection is online or not.
	 */
	isOnline():boolean{
		return !!this.client && this.client.connected;
	}

	/**
	 * 名称
	 */
	getClientName():string{
		return this.clientName;
	}

	/**
	 * the capricious ID ,from the socket.io client
	 */
	getClientId():string{
		if(this.isOnline()){
			return this.client.id;
		}else{
			return null;
		}
	}

	joinRoom(roomId:string){

		if(this.isOnline()){
			if(roomId){
				if(!this.roomIds.has(roomId)){
					this.roomIds.set(roomId,roomId);
					this.client.emit('joinRoom',roomId);
				}
			}else{
				throw new Error('roomId can‘t be null');
			}
		}else{
			throw new OfflineError('Offline');
		}

	}

	joinRooms(...roomIds:string[]){

		if(this.isOnline()){
			if(roomIds && roomIds.length>0){
				for (let i = 0; i < roomIds.length; i++) {
					this.roomIds.set(roomIds[i],roomIds[i]);
				}
				this.client.emit('joinRoom',roomIds.flat(1));
			}else{
				throw new Error('roomIds can‘t be null');
			}
		}else{
			throw new OfflineError('Offline');
		}
	}

	/**
	 * quit one of the rooms
	 */
	leaveRoom(roomId:string){

		if(this.isOnline()){
			if(roomId && this.roomIds.has(roomId)){
				this.roomIds.delete(roomId);
				this.client.emit('leaveRoom',false,roomId);
			}else{
				this.logger.warn(`${this.clientName} never be in a room or roomId[${roomId}] invalid`,'\r\n');
			}
		}else{
			throw new OfflineError('Offline');
		}

	}

	/**
	 * close the connection and quit all the rooms
	 */
	leaveRooms(){
		if(this.isOnline()){
			this.client.emit('leaveRoom',true);
			let roomIds:string[] = Array.from(this.roomIds.keys());
			this.logger.info(`${this.clientName} never be in a room or roomId[${roomIds.join(',')}] invalid`,'\r\n');
			this.roomIds.clear();
		}else{
			throw new OfflineError('Offline');
		}
	}

	getRooms():Map<string,string>{
		return this.roomIds;
	}

	/**
	 * talking to someone
	 * @param talking
	 */
	talkTo(talking:Partial<TalkAbout>):boolean{

		if(this.isOnline()){
			if(!talking.sender &&
				(!talking.receiver || (talking.roomIds && talking.roomIds.length<0))
			){
				throw new Error('sender or receiver or roomIds can‘t be null');
			}
			this.client.emit('talkTo',talking);
			return true;
		}else{
			throw new OfflineError('Offline');
		}
	}

	/**
	 * read the message of the senders
	 * @param statuses
	 */
	readMessages(...messageStatuses:ReadStatus[]):boolean{

		if(this.isOnline()){
			if(messageStatuses && messageStatuses.length>0){
				this.client.emit('readMessages',messageStatuses);
				return true;
			}else{
				throw new Error('messageStatuses can’t be null');
			}

		}else{
			throw new OfflineError('Offline');
		}
	}

	/**
	 * disconnecting the server
	 * @param clearUnderlingConnection 是否彻底关闭 true关闭所有连接并退出聊天,false只关闭当前连接
	 */
	disconnect(clearUnderlingConnection:boolean=true){
		if(this.isOnline()){
			if(clearUnderlingConnection){
				this.leaveRooms();
			}else{
				this.client.disconnect();
			}
		}else{
			throw new OfflineError('Already Offline');
		}
	}

	/**
	 * connect the server
	 */
	connect(){
		this.client.connect();
	}
}