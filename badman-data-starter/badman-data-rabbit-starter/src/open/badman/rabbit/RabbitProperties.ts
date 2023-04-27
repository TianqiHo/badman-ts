


import RabbitConnectionProperties from "./RabbitConnectionProperties";
import RabbitConsumerProperties from "./RabbitConsumerProperties";
import RabbitProducerProperties from "./RabbitProducerProperties";
import RabbitSocketProperties from "./RabbitSocketProperties";


export default interface RabbitProperties {

	rabbit: RabbitConnectionProperties;
	socket ?: RabbitSocketProperties;
	producer ?:RabbitProducerProperties;
	consumer ?:RabbitConsumerProperties



}