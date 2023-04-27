

import RabbitAdminCommands from "./RabbitAdminCommands";
import RabbitCommands from "./RabbitCommands";


export default interface RabbitConnection {


	getCommands():RabbitCommands;

	getAdminCommands():RabbitAdminCommands;

	open():boolean;

	close():boolean;

	isClosed():boolean;

}