

import AbstractWebSocketServerConnection from "./open/badman/websocket/AbstractWebSocketServerConnection";
import AbstractWebSocketServer from "./open/badman/websocket/AbstractWebSocketServer";
import RequestBodyEntity from "./open/badman/websocket/RequestBodyEntity";
import WebSocketServerProperties from "./open/badman/websocket/WebSocketServerProperties";
import WebSocketClientProperties from "./open/badman/websocket/WebSocketClientProperties";
import WebSocketProperties from "./open/badman/websocket/WebSocketProperties";
import AbstractChatClient from "./open/badman/chatt/client/AbstractChatClient";
import ChatClientProperties from "./open/badman/chatt/client/ChatClientProperties";
import ChatServer from "./open/badman/chatt/server/ChatServer";
import ChatServerProperties from "./open/badman/chatt/server/ChatServerProperties";
import OfflineError from "./open/badman/chatt/error/OfflineError";
import EmptyPropertiesError from "./open/badman/chatt/error/EmptyPropertiesError";
import ReadStatus from "./open/badman/chatt/entity/ReadStatus";
import SentStatus from "./open/badman/chatt/entity/SentStatus";
import TalkAbout from "./open/badman/chatt/entity/TalkAbout";
import DefaultNewsSendingStrategy from "./open/badman/chatt/strategy/DefaultNewsSendingStrategy";
import NewsSendingStrategy from "./open/badman/chatt/strategy/NewsSendingStrategy";
import NewsReceivingStrategy from "./open/badman/chatt/strategy/NewsReceivingStrategy";
import UdpError from "./open/badman/udp/UdpError";
import AbstractUdp from "./open/badman/udp/AbstractUdp";
import UdpProperties from "./open/badman/udp/UdpProperties";


export default class BadmanWebSocket {

	async main(){

		// let properties:WebSocketServerProperties = {
		// 		port: 1000,
		// 		path: '/custom',
		// 		heartBeatInterval : 10000
		// }
		//
		// await new DefaultWebSocketServer(properties,logger).afterInitialized();

		// let roomId = '123321';
		// let A:AbstractChatClient = new AbstractChatClient('A',roomId);

		// await A.afterInitialized();
		// let B:AbstractChatClient = new AbstractChatClient('B',roomId);
		// await B.afterInitialized();

		// let C:AbstractChatClient = new AbstractChatClient('C',roomId);
		// await C.afterInitialized();

		// setTimeout(()=>{
		// 	console.info('------------------ss1-------------');
		// 	let aa = A.isOnline();
		// 	let bb = B.isOnline();
		// 	console.info(aa,bb);
		// 	if(aa && bb){
		// 	let msg:TalkAbout = new TalkAbout(1,A.getClientName(),null,[roomId],"Fuck 美国",false);
		// 	A.talkTo(msg);
		// 	}
		// }, 2000);


		// setTimeout(()=>{
		// 	console.info('------------------ss2-------------');
		//     C.leaveRoom(roomId);
		// }, 5000);
		//
		//
		// setTimeout(()=>{
		// 	console.info('------------------ss3-------------');
		// 	let msg:TalkAbout = new TalkAbout(1,A.getClientName(),null,[roomId],"Fuck 美国2",false);
		// 	A.talkTo(msg);
		// }, 8000);
		//
		// setTimeout(()=>{
		// 	console.info('------------------ss4-------------');
		// 	let msg:TalkAbout = new TalkAbout(1,A.getClientId(),[B.getClientId()],null,"Fuck 美国3",false);
		// 	A.talkTo(msg);
		// }, 2000);

	}

}


// (() => {
// 	//new BadmanWebSocket().main();
// 	//new ChatDemoServer().main();
// })();

export {
	AbstractWebSocketServerConnection,
	AbstractWebSocketServer,
	RequestBodyEntity,
	WebSocketServerProperties,
	WebSocketClientProperties,
	WebSocketProperties,
	AbstractChatClient,
	ChatClientProperties,
	ChatServer,
	ChatServerProperties,
	OfflineError,
	EmptyPropertiesError,
	ReadStatus,
	SentStatus,
	TalkAbout,
	DefaultNewsSendingStrategy,
	NewsSendingStrategy,
	NewsReceivingStrategy,
	UdpError,
	AbstractUdp,
	UdpProperties
}