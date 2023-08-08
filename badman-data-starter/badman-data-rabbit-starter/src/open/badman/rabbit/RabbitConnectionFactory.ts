

import RabbitConnection from "./RabbitConnection";


export default interface RabbitConnectionFactory {

	createConnection():Promise<RabbitConnection>;

	isClosed():boolean;

	recovery();

	close();

	//closeGracefully();

}