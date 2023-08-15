

import {Logger} from "log4js";
import AbstractChatClient from "../../open/badman/chatt/client/AbstractChatClient";
import ChatClientProperties from "../../open/badman/chatt/client/ChatClientProperties";
import MT from "../../open/badman/chatt/entity/MT";
import ReadStatus from "../../open/badman/chatt/entity/ReadStatus";
import SentStatus from "../../open/badman/chatt/entity/SentStatus";


export default class MyClient extends AbstractChatClient<MT>{


	constructor (clientName:string,server:string,logger:Logger,customProperties?:Partial<ChatClientProperties>) {
		super(clientName,server,logger,customProperties);
	}

	onReceive (message: MT) {
		//let copy:TalkAbout = Copy(message);
		//Object.setPrototypeOf(message,MT.prototype);
		this.logger.info('-----------------------------------------start--------------------------------------------');
		this.logger.info(`${this.clientName} - ReceiveFrom [${message.sender}]:`,'\r\n');
		this.logger.info(message.content.toString());
		this.logger.info('-------------------------------------------end--------------------------------------------');
	}

	onRead (messageStatuses: ReadStatus) {
		this.logger.info('onRead->',messageStatuses);
	}

	onSent (sentStatus: SentStatus) {
		this.logger.info('sentStatus->',sentStatus);
	}

	onLogin (msg: {success,msg}) {
		this.logger.info('login-response-success ->',msg.success);
		this.logger.info('login-response-msg ->',msg.msg);
		//this.joinRoom('小绿');
	}

	loginRepeatedly (clientParam) {
		this.logger.info('login-repeatedly ->',clientParam);
	}
}