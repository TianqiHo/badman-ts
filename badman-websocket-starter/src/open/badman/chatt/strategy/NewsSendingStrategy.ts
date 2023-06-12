

import {Socket} from "socket.io/dist/socket";
import TalkAbout from "../entity/TalkAbout";


export default interface NewsSendingStrategy<News>{


	preSending(news:TalkAbout):Promise<News>;

	postSending(connection:Socket,news: TalkAbout,preSendingResult:News):Promise<void>;

	afterSending(connection: Socket,news: TalkAbout);

}