

import {Socket} from "socket.io/dist/socket";
import ReadStatus from "../entity/ReadStatus";


export default interface NewsSendingStrategy<News>{


	//preSending(news:TalkAbout):Promise<News>;

	preSending(connection:Socket,news:News):Promise<void>;

	postSending(connection:Socket,news: News):Promise<void>;

	afterSending(connection: Socket,news: News);

	afterRead(messageStatuses:ReadStatus[]):Promise<void>;

}