

import {Initializing, NetParser} from "badman-core";
import * as dgram from "dgram";
import {Logger} from "log4js";
import UdpError from "./UdpError";
import UdpProperties from "./UdpProperties";

export enum UdpType {

	UDP4 = 'udp4',

	UDP6 = 'udp6'
}

export default abstract class AbstractUdp implements Initializing{


	protected logger:Logger;

	protected heart:dgram.Socket;

	protected properties:UdpProperties;

	protected isAlive:boolean;

	protected constructor (properties:UdpProperties,logger:Logger) {
		if(!logger){
			throw new Error('logger can not be null');
		}
		this.logger = logger;

		if(!properties){
			throw new Error('UdpProperties can not be null');
		}

		if(!properties.port){
			throw new Error('port can not be null');
		}

		if(!properties.type){
			properties.type = UdpType.UDP4;
		}

		this.properties = properties;

		this.heart = dgram.createSocket(properties);

		this.heart.bind(properties.port,properties.address,()=>{
			this.logger.info(`The ${properties.type} server is running,port:${this.properties.port},address:${this.properties.address?this.properties:new NetParser().parseIPV4Address().toString()}\r\n`);
		});

	}


	/**
	 *  on(event: 'close', listener: () => void): this;
	 *  on(event: 'connect', listener: () => void): this;
	 *  on(event: 'error', listener: (err: Error) => void): this;
	 *  on(event: 'listening', listener: () => void): this;
	 *  on(event: 'message', listener: (msg: Buffer, rinfo: RemoteInfo) => void): this;
	 */
	async afterInitialized (): Promise<void> {

		//UDP 是无连接的协议，因此这里的 connect 并不是在通信双方之间建立真正的连接，
		//而只是用来设置通信另一端的地址和端口号；连接建立后，socket.send() 调用无需指定 port 和 address 参数，并且仅能收到连接指定的通信另一端的数据报
		this.heart.on('connect',()=>{
			this.logger.info('connect -> Received connection\r\n');
		});

		this.heart.on('close',()=>{
			this.isAlive = false;
			this.logger.info('close -> Received close\r\n');
		});

		this.heart.on('error',(err:Error)=>{
			this.logger.error('error -> Received error',err);
			this.logger.error('error -> Received error isAlive:',this.isAlive);
			if(err instanceof UdpError){
				this.logger.error('error -> Received UdpError',err);
			}else{

			}
			this.onError(err);
		});

		this.heart.on('listening',()=>{
			//服务真正启动成功了
			this.isAlive =true;
			this.logger.info('listening -> Received listening\r\n')
		});

		this.heart.on('ping',(msg)=>{
			this.logger.info(`listening -> Received ping msg = ${msg}\r\n`);
			this.emit('pong',this.isAlive);
		});

		this.heart.on('pong',(oldState:boolean)=>{
			this.logger.info(`listening -> Received pong oldState = ${oldState}\r\n`);
			this.isAlive = true;
		});

		this.heart.on('message',(message:Buffer,clientInfo:dgram.RemoteInfo)=>{
			this.logger.info('message -> Received message,message:\r\n',message.toString(),'from client:\r\n ',clientInfo,'\r\n');

			let m: string = message.toString();
			switch (m) {
				case 'ping':
					this.ping('from remote');
					this.send(Buffer.from(new String(this.isAlive)), clientInfo.port, clientInfo.address);
					break;
				case 'pong(Unmaintained)':
					this.emit('pong');
					break;
				case 'isAlive':
					//服务端状态
					this.send(Buffer.from(new String(this.isAlive)), clientInfo.port, clientInfo.address);
					break;

				default:
					this.handleMessage(m, clientInfo);
					break;
			}
		});
	}

	protected abstract handleMessage(message:string,clientInfo:dgram.RemoteInfo);

	onError(err:Error){}

	isServerAlive():boolean{
		return this.isAlive;
	}

	send(message:Buffer,port?:number,address?:string){
		this.logger.info(` ${this.properties.port} send to ${port}`);
		this.heart.send(message,port,address);
	}

	/**
	 * 缓存要连接的服务端信息
	 * @param port
	 * @param address
	 */
	lessConnectTo(port:number,address:string) {
		this.heart.connect(port,address,()=>{
			this.logger.info('连接成功');
		});
	}

	ref():dgram.Socket{
		return this.heart.ref();
	}
	unref():dgram.Socket{
		return this.heart.unref();
	}

	emit(event:string | symbol,...args:any[]){
		this.heart.emit(event,args.flat(1));
	}

	addListener(event: string, listener: (...args: any[]) => void){
		this.heart.addListener(event,listener);
	}

	ping(msg?:any){
		this.emit('ping',msg);
	}

}