

export declare type MessageType = 1|2|3|4;

export default class TalkAbout {

	newsId:number;

	senderName:string;

	sender:string;

	receiver:string;

	//@ 某些人
	atReceivers:string[];

	roomIds:string[];

	exceptRoomIds:string[];

	content:Buffer;

	sendState:boolean;

	// 1 普通文本, 2 照片, 3 语音  4 @类型
	messageType: MessageType


	constructor (newsId:number,content:Buffer,messageType: MessageType) {
		this.newsId = newsId;
		this.content = content;
		this.messageType = messageType;
	}


	setAtReceivers(atReceivers:string[]){
		this.atReceivers = atReceivers;
	}

	getAtReceivers():string[]{
		return this.atReceivers;
	}

	setContent(content:Buffer){
		this.content = content;
	}

	getContent():Buffer{
		return this.content;
	}

	setNewsId(newsId:number){
		this.newsId = newsId;
	}

	getNewsId(){
		return this.newsId;
	}

	setState(sendState:boolean){
		this.sendState = sendState;
	}

	getState():boolean{
		return this.sendState ;
	}

	setReceiver(receiver:string){
		this.receiver = receiver;
	}

	getReceiver():string{
		return this.receiver;
	}

	setSender(sender:string){
		this.sender = sender;
	}

	getSender():string{
		return this.sender;
	}

	setSenderName(senderName:string){
		this.senderName = senderName;
	}

	getSenderName():string{
		return this.senderName;
	}


	setRoomIds(roomIds:string[]){
		this.roomIds = roomIds;
	}

	getRoomIds():string[]{
		return this.roomIds;
	}

	setExceptRoomIds(exceptRoomIds:string[]){
		this.exceptRoomIds = exceptRoomIds;
	}

	getExceptRoomIds():string[]{
		return this.exceptRoomIds;
	}

	setMessageType(messageType: MessageType){
		this.messageType = messageType;
	}
	getMessageType():MessageType{
		return this.messageType;
	}


	toString():string{
		return `[
		    newsId = ${this.newsId},
		    sender = ${this.sender},
		    receiver = ${this.receiver},
		    roomIds = ${this.roomIds},
		    exceptRoomIds = ${this.exceptRoomIds},
		    messageType = ${this.messageType},
		    content = ${this.content.toString()},
		    sendState = ${this.sendState},
		    senderName = ${this.senderName}
		]`;
	}
}

export function Copy(data):TalkAbout {
	let copy:TalkAbout = new TalkAbout(null,null,null);
	Object.assign(copy,data);
	return copy;
}
