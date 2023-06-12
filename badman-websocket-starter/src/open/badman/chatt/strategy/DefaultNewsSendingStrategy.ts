

import {Logger} from "log4js";
import SentStatus from "../entity/SentStatus";
import TalkAbout from "../entity/TalkAbout";
import {Socket} from "socket.io/dist/socket";
import NewsSendingStrategy from "./NewsSendingStrategy";


export default class DefaultNewsSendingStrategy implements NewsSendingStrategy<TalkAbout>{

	private logger:Logger;

	constructor (logger:Logger) {
		this.logger = logger;
	}

	async preSending (news: TalkAbout): Promise<TalkAbout> {

		//news.sendState = true;

		//let ats:string[] = news.getAtReceivers();

		return news;
	}



	postSending (connection: Socket, news: TalkAbout, preSendingResult: TalkAbout): Promise<void> {
		let who:string[] = null;

		if(news.getRoomIds()){
			who = news.getRoomIds();
		}

		if(!who && news.getReceiver()){
			who = [news.getReceiver()];
		}

		if(who && who.length>0){
			connection.to(who).emit('receiveFrom',preSendingResult);
		}else{
			this.logger.error(`当前[${news.getSender()}-${news.getContent()}]的消息发送失败,未指定接受者`,'\r\n');
		}

		return;
	}


	afterSending (connection: Socket,news: TalkAbout) {

		news.setState(true);

		let sentStatus:Partial<SentStatus> = {
			state: true,
			sender: news.sender,
			newsId: news.newsId
		}

		connection.to(news.getSender()).emit('sent',sentStatus);
	}

}