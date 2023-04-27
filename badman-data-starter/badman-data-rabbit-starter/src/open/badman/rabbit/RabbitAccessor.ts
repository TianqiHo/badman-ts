

import RabbitConnectionFactory from "./RabbitConnectionFactory";


export default abstract class RabbitAccessor {


	protected rabbitConnectionFactory:RabbitConnectionFactory;

	protected constructor (rabbitConnectionFactory:RabbitConnectionFactory) {

		if(rabbitConnectionFactory){
			this.rabbitConnectionFactory = rabbitConnectionFactory;
		}else{
			throw new Error('RabbitConnectionFactory can not be null');
		}

	}
}