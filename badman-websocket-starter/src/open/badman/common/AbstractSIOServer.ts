

import Http from "http";
import {Http2SecureServer} from "http2";
import {Server as HTTPSServer} from "https";
import {Logger} from "log4js";
import {Server} from "socket.io";
import {Adapter} from "socket.io-adapter";
import {RemoteSocket} from "socket.io/dist/broadcast-operator";
import {Namespace} from "socket.io/dist/namespace";
import {Handshake} from "socket.io/dist/socket";



export default abstract class AbstractSIOServer {

	protected readonly logger:Logger;

	protected readonly server:Server;

	protected readonly namespaceStr:string;

	protected namespace:Namespace;

	private closed:boolean = true;

	protected constructor (namespace:string,
	                       logger:Logger,
						   properties:any,
	                       heart?:number | Http.Server | HTTPSServer | Http2SecureServer) {
		this.logger = logger;

		this.namespaceStr = namespace || '/';
		this.logger.debug('The namespaceStrValue is %s ',this.namespaceStr);
		// if(!this.namespaceStr){
		// 	throw new EmptyPropertiesError('namespace property field ');
		// }
		if(!this.namespaceStr.includes('/',0)){
			throw new URIError(this.namespaceStr);
		}

		this.server = new Server(heart,properties);
		this.namespace = this.server.of(this.namespaceStr);
		this.closed = false;
		this.server.on("connection_error", (err) => {
			this.logger.error(' SIOServer Error ->',err);
		});

	}


	adapter(adapter:Adapter){
		// @ts-ignore
		this.server.adapter(adapter);
	}

	getHeart(){
		return this.server;
	}

	getNsp():Namespace{
		return this.namespace;
	}


	/**
	 * Get the connection by roomId(maybe)
	 * @param roomIds
	 */
	async getSockets(...roomIds:string[]):Promise<RemoteSocket<any,any>[]>{
		let sockets: RemoteSocket<any,any>[] = [];
		if(roomIds && roomIds.length>0){
			sockets = await this.getNsp().in(roomIds).fetchSockets();
		}else {
			sockets = await this.getNsp().fetchSockets();
		}
		return sockets;
	}

	isClosed():boolean{
		return this.closed;
	}

	async close(){
		this.logger.debug('Closing SIOServer.....');

		this.server.close(async (err:Error)=>{
			if(err){
				this.logger.error('Closing SIOServer err',err);
				this.closed = false;
			}else{
				this.closed = true;
				// while (!this.closed){
				// 	await Base.sleep(2000,()=>{
				// 		this.logger.debug('Waiting Close SIOServer.....');
				// 	});
				// }
				this.logger.debug('Closing SIOServer successfully.....');
			}
		});

		this.server._nsps.forEach((value,key)=>{
			value.disconnectSockets(true);
		});
	}


	/**
	 * Get current room's members
	 * @param excluding
	 * @param roomIds
	 */
	async getReceives(excluding:string,...roomIds:string[]):Promise<any[]>{

		let sockets:RemoteSocket<any,any>[] = await this.getSockets(...roomIds);
		if(!sockets || sockets.length<=0){
			return [];
		}
		let receives:any[] = sockets.map((socket:RemoteSocket<any,any>,index:number)=>{

			let handshake:Handshake = socket.handshake;
			let client:object = {
				namespace:this.namespaceStr,
				id:socket.id,
				clientName:socket.data.clientName,
				roomIds:socket.rooms,
				time: handshake.time,
				address: handshake.address,
				xdomain: handshake.xdomain,
				secure: handshake.secure,
				url:handshake.url,
				query:handshake.query,
				auth:handshake.auth,
				transportDataInConnection: socket.data
			};

			if(excluding && excluding !== socket.data.clientName){
				return client;
			}else{
				return client;
			}
		});
		return receives;
	}

	async getReceivesGroupByRoomId():Promise<any>{

		let sockets:RemoteSocket<any,any>[] = await this.getSockets();
		if(!sockets || sockets.length<=0){
			return {};
		}
		let group:any = {};
		sockets.forEach((socket:RemoteSocket<any,any>)=>{

			let client:object = {clientName:socket.data.clientName,namespace:this.namespaceStr,id:socket.id};

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

}