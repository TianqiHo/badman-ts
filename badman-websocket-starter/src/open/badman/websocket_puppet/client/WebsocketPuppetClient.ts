

import {SyncInitializing} from "badman-core";
import {Logger} from "log4js";
import {io, Socket} from "socket.io-client";
import EmptyPropertiesError from "../../chatt/error/EmptyPropertiesError";
import WebsocketPuppetClientProperties from "../properties/WebsocketPuppetClientProperties";


export default class WebsocketPuppetClient implements SyncInitializing{

	protected readonly logger:Logger;

	/**
	 *  important! for receiving or sending personal message
	 */
	protected readonly clientId:string;

	//the connection
	protected readonly client:Socket;

	private init:boolean;


	constructor (server:string,logger:Logger,customProperties:Partial<WebsocketPuppetClientProperties>) {
		if(logger){
			this.logger = logger;
		}

		this.clientId = customProperties.clientId;
		if(!this.clientId){
			throw new EmptyPropertiesError('clientId property field');
		}

		this.client = io(server,customProperties);

		//登录提示
		this.client.on('connect_login',msg => {
			this.logger.warn(msg);
		});

		this.client.on('leave_join_error',msg => {
			this.logger.error(msg);
		});

		this.client.on('connect',async ()=>{
			await this.afterInitialized();
		});

		// this.client.on("disconnect", (reason: Socket.DisconnectReason, description?: DisconnectDescription) => {
		// 	this.logger.error(`${this.clientId}·断开连接成功 state = ${this.client.connected}, reason = ${description}\r\n`);
		// });
	}

	isOnline(){
		return this.client && this.client.connected;
	}
	afterInitialized (): void {

		if(this.init){
			if(this.isOnline()){
				this.logger.info(`${this.clientId}·重连接成功`,'\r\n');
			}else{
				this.logger.info(`${this.clientId}·已断开连接`,'\r\n');
			}
			return;
		}else{
			//防止重连后 调用多次afterInitialized()
			this.init=true;
			this.logger.info(`${this.clientId}·连接成功`,'\r\n');

			//接收消息
			this.client.on('message',(message) => {
				this.logger.info(`${this.clientId} ----receive-->\r\n`,message);
			});
		}
	}


	send<T>(to:string,content:T){
		if(!to){
			throw new EmptyPropertiesError('where field');
		}
		if(!content){
			throw new EmptyPropertiesError('content field');
		}
		this.client.send({to:to,content:content});
	}

	join(clientId:string){
		this.client.emit('join',clientId);
	}

	leave(clientId:string){
		this.client.emit('leave',clientId);
	}

	getClientId():string{
		return  this.clientId;
	}

	getClient():Socket{
		return this.client;
	}
}