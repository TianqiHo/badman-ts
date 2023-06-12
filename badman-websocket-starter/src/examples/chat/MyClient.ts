

import {Logger} from "log4js";
import AbstractChatClient from "../../open/badman/chatt/client/AbstractChatClient";
import ChatClientProperties from "../../open/badman/chatt/client/ChatClientProperties";
import ReadStatus from "../../open/badman/chatt/entity/ReadStatus";
import SentStatus from "../../open/badman/chatt/entity/SentStatus";
import TalkAbout, {Copy} from "../../open/badman/chatt/entity/TalkAbout";


export default class MyClient extends AbstractChatClient<TalkAbout>{


	constructor (clientName:string,server:string,logger:Logger,customProperties?:Partial<ChatClientProperties>) {
		super(clientName,server,logger,customProperties);
	}
	onReceive (message: TalkAbout) {
		let copy:TalkAbout = Copy(message);
		this.logger.info('-----------------------------------------start--------------------------------------------');
		this.logger.info(`${this.clientName} - ReceiveFrom [${copy.getSender()}]:`,'\r\n');
		this.logger.info(copy.getContent().toString());
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
	}
}