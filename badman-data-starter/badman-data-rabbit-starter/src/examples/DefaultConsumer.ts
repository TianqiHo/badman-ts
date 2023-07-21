

import {Channel, ConsumeMessage} from "amqplib";
import RabbitConsumer from "../open/badman/rabbit/RabbitConsumer";


export default class DefaultConsumer implements RabbitConsumer<Channel,ConsumeMessage>{


	async consume(channel:Channel,message:ConsumeMessage){
		console.log('-----------------',JSON.stringify(message.content));
	}

}