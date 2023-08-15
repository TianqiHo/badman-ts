

export declare type MessageType = 1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20;

export default class TalkAbout {

	newsId:string;

	senderName:string;

	sender:string;

	receiver:string;

	//@ someones
	atReceivers:string[];

	roomId:string;

	exceptRoomIds:string[];

	content:Buffer;

	sendState:boolean;

	sendTime:Date;

	// 1 emergency/important  2 text   3 voice   4 image   5 video   6 file  7 @  8-20 for your custom
	messageType: MessageType


	// constructor (newsId:string,content:Buffer,messageType: MessageType) {
	// 	this.newsId = newsId;
	// 	this.content = content;
	// 	this.messageType = messageType;
	// }

	//
	// setAtReceivers(atReceivers:string[]){
	// 	this.atReceivers = atReceivers;
	// }
	//
	// getAtReceivers():string[]{
	// 	return this.atReceivers;
	// }
	//
	// setContent(content:Buffer){
	// 	this.content = content;
	// }
	//
	// setSendTime(sendTime:Date){
	// 	this.sendTime = sendTime;
	// }
	//
	// getSendTime():Date{
	// 	return this.sendTime;
	// }
	//
	// getContent():Buffer{
	// 	return this.content;
	// }
	//
	// setNewsId(newsId:string){
	// 	this.newsId = newsId;
	// }
	//
	// getNewsId(){
	// 	return this.newsId;
	// }
	//
	// setState(sendState:boolean){
	// 	this.sendState = sendState;
	// }
	//
	// getState():boolean{
	// 	return this.sendState ;
	// }
	//
	// setReceiver(receiver:string){
	// 	this.receiver = receiver;
	// }
	//
	// getReceiver():string{
	// 	return this.receiver;
	// }
	//
	// setSender(sender:string){
	// 	this.sender = sender;
	// }
	//
	// getSender():string{
	// 	return this.sender;
	// }
	//
	// setSenderName(senderName:string){
	// 	this.senderName = senderName;
	// }
	//
	// getSenderName():string{
	// 	return this.senderName;
	// }
	//
	//
	// setRoomId(roomId:string){
	// 	this.roomId = roomId;
	// }
	//
	// getRoomId():string{
	// 	return this.roomId;
	// }
	//
	// setExceptRoomIds(exceptRoomIds:string[]){
	// 	this.exceptRoomIds = exceptRoomIds;
	// }
	//
	// getExceptRoomIds():string[]{
	// 	return this.exceptRoomIds;
	// }
	//
	// setMessageType(messageType: MessageType){
	// 	this.messageType = messageType;
	// }
	// getMessageType():MessageType{
	// 	return this.messageType;
	// }
	//
	//
	// toString():string{
	// 	return `[
	// 	    newsId = ${this.newsId},
	// 	    sender = ${this.sender},
	// 	    receiver = ${this.receiver},
	// 	    roomIds = ${this.roomId},
	// 	    sendTime = ${this.sendTime},
	// 	    exceptRoomIds = ${this.exceptRoomIds},
	// 	    messageType = ${this.messageType},
	// 	    content = ${this.content.toString()},
	// 	    sendState = ${this.sendState},
	// 	    senderName = ${this.senderName}
	// 	]`;
	// }
}
