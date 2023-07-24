

import {Logger} from "log4js";
import MT from "../entity/MT";
import ReadStatus from "../entity/ReadStatus";
import SentStatus from "../entity/SentStatus";
import {Socket} from "socket.io/dist/socket";
import EmptyPropertiesError from "../error/EmptyPropertiesError";
import NewsSendingStrategy from "./NewsSendingStrategy";


export default class DefaultNewsSendingStrategy implements NewsSendingStrategy<MT>{

	private logger:Logger;

	constructor (logger:Logger) {
		this.logger = logger;
	}

	async preSending (connection:Socket,news: MT): Promise<void> {
		//throw new EmptyPropertiesError('322322323');
		//connection.emit('');
		//Object.setPrototypeOf(news,MT.prototype);
		//this.logger.error(connection.handshake.headers.aaa);

		//news.sendState = true;

		//let ats:string[] = news.getAtReceivers();

		//return;
	}



	postSending (connection: Socket, news: MT): Promise<void> {


		let who:string = null;

		if(news.roomId){
			who = news.roomId;
		}

		if(!who && news.receiver){
			who = news.receiver;
		}

		if(who && who.length>0){
			connection.to(who).emit('receiveFrom',news);
		}else{
			this.logger.error(`当前[${news.sender}-${news.content}]的消息发送失败,未指定接受者`,'\r\n');
		}

		return;
	}


	afterSending (connection: Socket,news: MT) {

		news.sendState = true;

		let sentStatus:Partial<SentStatus> = {
			roomId: news.roomId,
			state: true,
			sender: news.sender,
			newsId: news.newsId,
			serverSendTime: new Date()
		}

		connection.to(news.sender).emit('sent',sentStatus);
	}

	async afterRead (messageStatuses: ReadStatus[]) {

		return;
	}

}