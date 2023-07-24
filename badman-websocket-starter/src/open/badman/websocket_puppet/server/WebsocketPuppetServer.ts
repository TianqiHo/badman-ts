

import {Initializing} from "badman-core";
import Http from "http";
import {Http2SecureServer} from "http2";
import {Server as HTTPSServer} from "https";
import {Logger} from "log4js";
import {Server} from "socket.io";
import {RemoteSocket} from "socket.io/dist/broadcast-operator";
import {Socket} from "socket.io/dist/socket";
import EmptyPropertiesError from "../../chatt/error/EmptyPropertiesError";
import WebsocketPuppetServerProperties from "../properties/WebsocketPuppetServerProperties";


export default abstract class WebsocketPuppetServer implements Initializing{


	protected readonly logger:Logger;

	protected readonly server:Server;

	protected properties:Partial<WebsocketPuppetServerProperties>;

	protected readonly namespace:string;

	protected constructor (properties:Partial<WebsocketPuppetServerProperties>,logger:Logger, heart?:Http.Server | HTTPSServer | Http2SecureServer) {
		this.logger = logger;
		this.properties = properties;

		this.namespace = properties.namespace;
		if(!this.namespace){
			throw new EmptyPropertiesError('namespace property field ');
		}

		if(!this.namespace.includes('/',0)){
			throw new URIError(this.namespace);
		}

		this.server = new Server(heart || properties.port,properties);
		this.server.on("connection_error", (err) => {
			this.logger.error(' WebsocketPuppetServer Error ->',err);
		});

	}

	abstract doWithConn(connection:Socket):Promise<void>;

	async afterInitialized (): Promise<void> {

		// '/' is  default path
		//socket就是一个普通对象 包含了客户端 和 服务端
		//connection alias for connect
		this.server.of(this.namespace).on('connect',async (connection:Socket)=>{

			let clientParam = connection.handshake.query;
			let clientId: string = clientParam.clientId.toString();

			if(clientId && clientId !== ''){
				if(!connection.data.clientId){
					connection.data.clientId = clientId;
				}

				connection.join(clientId);
				await this.doWithConn(connection);

				//提示连接服务端并登录成功
				connection.emit('connect_login',{success:true,id:connection.id,customId:clientId});

				// 监听客户端send()/message事件并匹配接受者（个人、群体）
				connection.on('message', (message) => {
					connection.to(message.to).emit('message',message.content);
				});

				connection.on('join', (another) => {
					if(another){
						connection.join(another);
					}else{
						connection.emit('leave_join_error',`端点无效@${another}`);
					}
				});

				connection.on('leave', (exist) => {
					if(exist){
						connection.leave(exist);
					}else{
						connection.emit('leave_join_error',`端点无效@${exist}`);
					}

				});

			}else{
				let msg = 'clientId不能为空,请检查websocket请求地址';
				this.logger.error(msg);
				connection.emit('connect_login',{success:false,msg:`${msg}`});
				connection.disconnect(false);
			}

		});
	}

	async getReceives(excluding:string,...roomIds):Promise<string[]>{

		let sockets: RemoteSocket<any,any>[] = [];
		if(roomIds && roomIds.length>0){
			sockets = await this.server.in(roomIds).fetchSockets();
		}else {
			sockets = await this.server.fetchSockets();
		}

		let receives:string[] = sockets.map((socket:RemoteSocket<any,any>,index)=>{
			if(excluding && excluding !== socket.data.clientId){
				return socket.data.clientId;
			}else{
				return socket.data.clientId;
			}

		});
		return receives;
	}

}