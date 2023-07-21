

import {Channel, Connection} from "amqplib";
import {Logger} from "log4js";
import RabbitAdminCommands from "../../RabbitAdminCommands";
import RabbitCommands from "../../RabbitCommands";
import RabbitConnection from "../../RabbitConnection";
import AmqpAdminCommands from "./AmqpAdminCommands";
import AmqpCommands from "./AmqpCommands";



export default class AmqpConnection implements RabbitConnection{


	private readonly logger:Logger;

	private connection: Connection;

	//private closed:boolean=false;

	constructor (connection: Connection,logger:Logger) {
		this.connection = connection
		this.logger = logger;
	}


	getCommands (): RabbitCommands {
		return new AmqpCommands(this,this.logger);
	}

	getAdminCommands (): RabbitAdminCommands {
		return new AmqpAdminCommands(this.logger,this);
	}

	 async getChannel(confirm:boolean): Promise<Channel> {
		if(confirm === true){
			return await this.connection.createConfirmChannel();
		}else{
			return await this.connection.createChannel();
		}
	 }

	// async close (): Promise<boolean> {
	// 	await this.connection.close();
	// 	this.closed=true;
	// 	return this.closed;
	// }
	//
	// isClosed (): boolean {
	// 	return this.closed;
	// }
	//
	// open (): boolean {
	// 	throw new Error('Not Implement yet')
	// 	return false;
	// }


}