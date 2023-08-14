import {MessageType} from "./TalkAbout";


export default interface ReadStatus{

	/**
	 * 消息唯一标识
	 */
	newsId:string;

	/**
	 * 群聊
	 */
	roomId:string;

	/**
	 * 读者
	 */
	reader:string;

	/**
	 * 发送者
	 */
	sender:string;

	/**
	 * 阅读时间
	 */
	readTime:Date;
	/**
	 * message type
	 */
	messageType:MessageType;

	/**
	 * the message is saved?
	 */
	isSave:boolean;

}