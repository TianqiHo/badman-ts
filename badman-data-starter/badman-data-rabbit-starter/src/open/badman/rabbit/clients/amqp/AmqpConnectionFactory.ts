

import {connect, Connection} from "amqplib";
import {Initializing} from "badman-core";
import {Domain} from "domain";
import {Logger} from "log4js";
import RabbitConnection from "../../RabbitConnection";
import RabbitConnectionFactory from "../../RabbitConnectionFactory";
import RabbitProperties from "../../RabbitProperties";
import AmqpConnection from "./AmqpConnection";



export default class AmqpConnectionFactory implements RabbitConnectionFactory,Initializing{


	private readonly logger:Logger;

	private connection: Connection;

	private closed:boolean;

	private rabbitProperties:RabbitProperties;

	//private c:any;

	private domain:Domain;

	constructor (rabbitProperties:RabbitProperties,logger:Logger) {

		this.logger = logger;
		this.rabbitProperties = rabbitProperties;
		this.closed = true;
		//this.c = require('amqplib/lib/connection');
		// this.domain = new Domain();
		// this.domain.on('error',async (err) => {
		// 	this.logger.error('Domain err->',err);
		// 	if(this.connection){
		// 		this.logger.info('connection Instance set null');
		// 		this.connection = null;
		// 	}
		// 	await this.connecting();
		// });
	}

	async afterInitialized () {

		// await this.domain.run(async () => {
		// 	process.nextTick(async () => {
				await this.connecting();
				await this.closeGracefully();
		// 	});
		// });
	}

	private async connecting(){
		if(this.closed){
			this.connection = await connect(this.rabbitProperties.rabbit,this.rabbitProperties.socket);
			this.closed = false;
			this.connection.on('error', (err) =>{
				//let important:boolean = this.c.isFatalError(err);
				this.logger.error(`connection error -> ` ,err);
			});
			this.connection.on('close', e => {
				this.closed = true;
				this.logger.warn('connection close->',e);
			});
		}else{
			this.logger.warn('Amqp connection is already in use');

		}
	}

	async createConnection (): Promise<RabbitConnection> {

		if(this.isClosed()){
			this.logger.info('重新连接');
			await this.recovery();
		}

		if(!this.connection){
			throw new Error('Rabbit connection has broken');
		}

		return new AmqpConnection(this.connection,this.logger);
	}

	isClosed():boolean{
		return this.closed;
	}

	async recovery(){
		await this.afterInitialized();
	}

	async close(){
		await this.connection.close();
	}

	closeGracefully() {
		process.on('SIGINT',async (sig)=>{
			if(sig === 'SIGINT' && !this.closed){
				await this.close();
				this.logger.info('The Amqp exit gracefully');
			}
		});
	}
}