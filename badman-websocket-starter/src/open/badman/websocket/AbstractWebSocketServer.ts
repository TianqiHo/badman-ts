

import {Base, Initializing} from "badman-core";
import {Logger} from "log4js";
import AbstractWebSocketServerConnection from "./AbstractWebSocketServerConnection";
import RequestBodyEntity from "./RequestBodyEntity";
import {WebSocketServer,WebSocket} from 'ws';
import WebSocketServerProperties from "./WebSocketServerProperties";


export default abstract class AbstractWebSocketServer<Request extends RequestBodyEntity,
														SocketClientConnection extends AbstractWebSocketServerConnection<Request>> implements  Initializing{


	protected logger:Logger;

	protected webSocketServer:WebSocketServer;

	private readonly connections:Map<string,SocketClientConnection>;

	protected serverProperties:WebSocketServerProperties;

	protected closed:boolean;

	protected constructor(serverProperties:WebSocketServerProperties,logger:Logger) {
		if(!logger || !serverProperties){
			throw new Error('constructor param[webSocketProperties or logger] can not be null');
		}
		this.logger = logger;
		this.closed = true;
		this.serverProperties = serverProperties;
		this.connections = new Map<string, SocketClientConnection>();
		this.webSocketServer = new WebSocketServer(this.serverProperties);
		this.closed = false;
		this.logger.info(`建立WebSocket服务器,监听端口:${this.serverProperties.port},root: ${this.serverProperties.path?this.serverProperties.path:this.serverProperties.context}`);
	}

	getServerProperties(){
		return this.serverProperties;
	}

	getLogger(){
		return this.logger;
	}

	getRuntimeRequests():Array<Request>{
		let all : Request[] = [];
		this.connections.forEach((value, key, map)=>{
			let r:Request = value.getRequestBody;
			all.push(r);
		});
		return all;
	}

	async afterInitialized () {
		//监听connection连接事件
		this.webSocketServer.on('connection', async (ws:WebSocket, request:any) => {
			let requestBody:Request = this.parseWebsocketRequest(request.url);
			if(requestBody.clientId){

				try {
					let r: boolean = await this.addConnection(ws, requestBody);
					if (r) {
						ws.send('{"success":true}');
					} else {
						ws.send('{"success":false,"msg":"请联系管理员查看失败原因"}');
						ws.close();
					}
				} catch (e) {
					this.logger.error('新增websocket客户端连接失败->',e);
					if(e.message){
						ws.send(`{"success":false,"msg":"${e.message}"}`);
					}else {
						ws.send(`{"success":false,"msg":"请联系管理员查看失败原因"}`);
					}
					ws.close();
				}
			}else{
				//let clientIP = req.socket.remoteAddress;
				let msg = 'clientId不能为空,请检查websocket请求地址';
				this.logger.error(msg);
				ws.send(`{"success":false,"msg":"${msg}"}`);
				ws.close();
			}
		});
	}

	private async addConnection(ws:WebSocket, requestBody:Request):Promise<boolean>{
		this.logger.debug('新客户端开始建立链接');
		if(this.connections.has(requestBody.clientId)){
			throw new Error(`客户端连接创建失败,${requestBody.clientId}[${requestBody.clientName}]已存在`);
		}
		let newConn:SocketClientConnection = this.newConnection(requestBody,ws);
		if(!newConn){
			throw new Error('客户端连接无效');
		}
		this.connections.set(requestBody.clientId,newConn);
		this.logger.debug(`第 ${this.connections.size}  个 connection已创建完成`);
		return true;
	}

	protected abstract newConnection(requestBody:Request,ws:WebSocket):SocketClientConnection;

	protected parseWebsocketRequest(remoteUri:string):Request{
		//解码，中文编码转化
		let uri: string = decodeURI(remoteUri);
		//截取path和query
		let pathAndQuery: string[] = uri.split('?');
		let requestBody: Object = {clientId:null};
		if (pathAndQuery.length >= 2 && pathAndQuery[1]) {
			let queryString: string = pathAndQuery[1];
			let queryElements: string[] = queryString.split('&');
			for (let eachElement of queryElements) {
				let kv: string[] = eachElement.split('=');
				requestBody[kv[0]] = kv[1];
				this.logger.debug(` ${kv[0]} = ${kv[1]} `);
			}
		}
		return <Request>requestBody;
	}


	public forceDeleteConnection(clientId:string):boolean{
		let r = this.connections.delete(clientId);
		this.logger.debug(`强制删除websocket客户端编号 clientId= ${clientId} 连接完毕,isDeleted = ${r}`);
		return r;
	}

	public deleteConnection(clientId:string):boolean{
		let connection:SocketClientConnection = this.connections.get(clientId);
		if(	this.canDeleteConnection(connection)){
			let r = this.connections.delete(clientId);
			this.logger.debug(`删除websocket客户端编号 clientId= ${clientId} 连接完毕`);
			return r;
		}
		return false;
	}

	public obtainConnection (clientId:string):SocketClientConnection{
		return this.connections.get(clientId);
	}

	protected abstract canDeleteConnection(connection:SocketClientConnection):boolean;

	async close(){
		this.webSocketServer.close((err:Error)=>{
			if(err){
				this.logger.error(err);
				this.closed = false;
				return;
			}else{
				this.closed = true;
			}
		});

		while (!this.closed){
			await Base.sleep(2000,()=>{
				this.logger.debug('Waiting Close WebsocketServer.....');
			});
		}
		this.logger.debug('Closing WebsocketServer successfully.....');

	}
}