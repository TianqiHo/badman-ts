

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

	private c:any;

	private domain:Domain;

	constructor (rabbitProperties:RabbitProperties,logger:Logger) {

		this.logger = logger;
		this.rabbitProperties = rabbitProperties;
		this.c = require('amqplib/lib/connection');
		this.domain = new Domain();
		this.domain.on('error',async (err) => {
			this.logger.error('AmqpConnectionFactory Domain err->',err);
			await this.connecting();
		});
	}

	async afterInitialized () {

		await this.domain.run(async () => {
			process.nextTick(async () => {
				await this.connecting();
			});
		});
	}

	private async connecting(){
		this.connection = await connect(this.rabbitProperties.rabbit,this.rabbitProperties.socket);
		this.closed = false;
		this.connection.on('error', e =>{
			this.logger.error('connection error-> isFatalError = ' + this.c.isFatalError(e),e);
		});
		this.connection.on('close', e=>{
			this.closed = true;
			this.logger.error('connection close->',e);
			if(this.connection){
				this.logger.error('connection Instance set null');
				this.connection = null;
			}
		});
	}

	async createConnection (): Promise<RabbitConnection> {

		if(this.isClosed()){
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
		await this.connecting();
	}

}