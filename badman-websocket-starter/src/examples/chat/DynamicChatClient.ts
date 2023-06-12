import {Logging, SingletonObjectFactory2} from "badman-core";
import {Configuration, Logger} from "log4js";
import readline from "readline";
import AbstractChatClient from "../../open/badman/chatt/client/AbstractChatClient";
import ChatClientProperties from "../../open/badman/chatt/client/ChatClientProperties";
import TalkAbout from "../../open/badman/chatt/entity/TalkAbout";

export default class DynamicChatClient {


	constructor () {

	}


	async main(){

		// let defaultConfiguration:Configuration = {
		// 	"appenders": {
		// 		"stdout_appender": {
		// 			"type": "stdout",
		// 			"layout": { "type": "pattern","pattern":"%[[CDPID(%z)]-[%d{yyyy-MM-dd hh:mm:ss.SSS} %c-%p] [%f{1}<%A>.%M(%l)] %] <=> %m %n" }
		// 		}
		// 	},
		// 	"categories": {
		// 		"default": {
		// 			"appenders": ["stdout_appender"],
		// 			"level": "info",
		// 			"enableCallStack": true
		// 		}
		// 	}
		// }
		//
		// let logging:Logging = await SingletonObjectFactory2.initWithArgs<Logging>(Logging,[defaultConfiguration]);
		// let logger:Logger = logging.logger();
		//
		// let roomId = '123321';
		//
		// let properties:Partial<ChatClientProperties> = {
		// 	addTrailingSlash: true,
		// 	autoUnref: true,
		// 	path: "/chatServer",
		// 	reconnectionAttempts: 10,
		// 	transports: ["polling"],
		// 	upgrade: false,
		// 	protocols: ['http', 'https']
		// }
		//
		// for (let i = 0; i < 3000; i++) {
		//
		// 	setTimeout(
		// 		()=>{
		// 			let temp:AbstractChatClient = new AbstractChatClient(i.toString(),roomId);
		// 		},
		// 		100
		// 	);
		//
		//
		// }
		//
		// let 村长:AbstractChatClient = new AbstractChatClient('村长',roomId);
		//
		// let rl = readline.createInterface({
		// 	input: process.stdin,
		// 	output: process.stdout
		// });
		//
		// rl.on('line', function (line) {
		//
		// 	logger.info('村长 - 客户端-》',line.trim(),'\r\n');
		//
		// 	let s:string = line.trim();
		// 	let aa:string[] = s.split(',');
		// 	if(aa[0] === 'count'){
		// 		//村长.count(aa[1]);
		// 	}else{
		// 		let msg:TalkAbout = new TalkAbout(1,村长.getClientName(),null,[roomId],s,false);
		// 		村长.talkTo(msg);
		// 	}
		//
		//
		// });

	}

}

(()=>{
	new DynamicChatClient().main();
})()