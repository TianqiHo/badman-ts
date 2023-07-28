

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
			this.logger.info(`The server receive connection‘s of the client[${clientId}]`);
			if(clientId && clientId !== ''){
				if(!connection.data.clientId){
					connection.data.clientId = clientId;
				}

				connection.join(clientId);
				this.logger.debug(`The server modify the client[${clientId}] ’s roomId,but not delete the client‘s sid `);
				await this.doWithConn(connection);

				//提示连接服务端并登录成功
				connection.emit('connect_login',{success:true,id:connection.id,customId:clientId});
				this.logger.debug(`The server has emitted[connect_login] to the client[${clientId}] has connected completely`);

				// 监听客户端send()/message事件并匹配接受者（个人、群体）
				connection.on('message', (message) => {
					this.logger.debug(`The server received the message[${message.content}] from the client[${clientId}]`);
					connection.to(message.to).emit('message',message.content);
					this.logger.debug(`The server has emitted the message event to the client[${message.to}]`);

				});

				connection.on('join', (another) => {
					if(another){
						connection.join(another);
						this.logger.debug(`The client[${clientId}] has joined to the client[${another}]`);
					}else{
						connection.emit('leave_join_error',`Invalid join point@${another}`);
						this.logger.error(`The client[${clientId}] can’t join to the client[${another}]`);
					}
				});

				connection.on('leave', (exist) => {
					if(exist){
						connection.leave(exist);
					}else{
						connection.emit('leave_join_error',`Invalid join point@${exist}`);
						this.logger.error(`The client[${clientId}] can’t leave to the client[${exist}]`);
					}

				});

			}else{
				let msg = 'the http query param clientId is empty';
				this.logger.error(`The client connect error,${msg}`);
				connection.emit('connect_login',{success:false,msg:`${msg}`});
				connection.disconnect(false);
				this.logger.debug(`The server has closed connection‘s of the client[${clientId}]`);
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