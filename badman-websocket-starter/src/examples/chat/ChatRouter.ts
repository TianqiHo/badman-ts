
import {Base, SingletonObjectFactory2} from "badman-core";
import e from "express";
import {Logger} from "log4js";
import {RemoteSocket} from "socket.io/dist/broadcast-operator";
import ChatClientProperties from "../../open/badman/chatt/client/ChatClientProperties";
import MT from "../../open/badman/chatt/entity/MT";
import ChatServer from "../../open/badman/chatt/server/ChatServer";
import MyClient from "./MyClient";


export default class ChatRouter {

	router:e.Router;

	logger:Logger;


	rooms:Map<string,string[]> = new Map<string, string[]>();
	all:Map<string,MyClient> = new Map<string, MyClient>();

	constructor(logger:Logger) {
		this.logger = logger;
		this.router = e.Router();
	}

	binds():e.Router{

		this.router.get('/login/:n',async (req, res:e.Response)=>{

			let clientName:string = req.params.n;
			let properties:Partial<ChatClientProperties> = {
				addTrailingSlash: true,
				//autoUnref: true,
				path: "/chatServer",
				reconnectionAttempts: 10,
				transports: ["polling"],
				upgrade: false,
				protocols: ['http', 'https'],
				extraHeaders: {
					aaa: 'aaaa'
				}
			}

			let c:MyClient = new MyClient(clientName,'http://localhost:8888',this.logger,properties);

			await Base.sleep(2000,()=>{
				this.logger.info('-------------------');
			})
			this.all.set(c.getClientId(),c);
			res.json({"login":true,"id":c.getClientId()});

		});


		this.router.get('/join/:n/:r/',(req, res:e.Response)=>{

			let clientName:string = req.params.n;
			let roomId:string = req.params.r;

			if(!clientName){
				res.json({"msg":"用户名【n】不能为空"});
				res.end();
			}

			let c:MyClient = this.all.get(clientName);
			c.joinRoom(roomId);

			if(this.rooms.has(roomId)){
				this.rooms.get(roomId).push(clientName);
			}else{
				this.rooms.set(roomId,[clientName]);
			}

			res.json({"joined":true,"name":clientName});
		});

		this.router.get('/leave/:n/:r/',(req, res:e.Response)=>{

			let clientName:string = req.params.n;
			let roomId:string = req.params.r;

			if(!clientName){
				res.json({"msg":"用户名【n】不能为空"});
				res.end();
				// return;
			}

			let client:MyClient = this.all.get(clientName);
			client.leaveRoom(roomId);

			if(this.rooms.has(roomId)){
				this.rooms.delete(roomId);
			}

			res.json({"joined":true,"name":clientName});
		});

		this.router.post('/group/:from/talking/:to',(req, res:e.Response)=>{

			let from:string = req.params.from;

			let to:string = req.params.to;

			let client:MyClient = this.all.get(from);

			// let talkAbout:TalkAbout = Copy(req.body); //new TalkAbout(null,null,null);
			// talkAbout.setNewsId((+Date.now()).toString());
			// talkAbout.setRoomId(to);
			// talkAbout.setSender(from);
			// talkAbout.setSenderName(from);
			// talkAbout.setState(false);
			//talkAbout.setContent(req.body.content);

			let mt:Partial<MT> = {
				newsId: (+Date.now()).toString(),
				roomId: to,
				sender: from,
				senderName: from,
				sendState: false,
				content: req.body.content,
				unReaders: ['123']
			}


			client.talkTo(mt);

			res.json({"talked":true});

		});

		this.router.post('/private/:from/talking/:to',(req, res:e.Response)=>{

			let from:string = req.params.from;
			let to:string = req.params.to;
			let client:MyClient = this.all.get(from);
			// let talkAbout:MT =  new MT(null,null,null); //<MT>Copy(req.body); //new TalkAbout(null,null,null);
			// talkAbout.setNewsId((+Date.now()).toString());
			// talkAbout.setReceiver(to);
			// talkAbout.setSender(from);
			// talkAbout.setSenderName(from);
			// talkAbout.setState(false);
			// talkAbout.setUnReaders(['32112321','sdwdw']);
			//talkAbout.setContent(req.body.content);
			let mt:Partial<MT> = {
				newsId: (+Date.now()).toString(),
				receiver: to,
				sender: from,
				senderName: from,
				sendState: false,
				content: req.body.content,
				unReaders: ['123']
			}
			client.talkTo(mt);
			res.json({"talked":true});
		});



		this.router.post('/rooms',(req:e.Request, res:e.Response)=>{
			let data = {};
			this.rooms.forEach((value, key) => {
				data[key] = value;
			});
			res.json({"rooms":data});
		});

		this.router.get('/roomReceivers/:excluding/:room',async (req:e.Request, res:e.Response)=>{

			let s:ChatServer = SingletonObjectFactory2.Instance<ChatServer>(ChatServer.name);
			let receivers:string[] = await s.getReceives(req.params.excluding,req.params.room);
			res.json({receivers:receivers});
		});

		this.router.get('/roomReceivers',async (req:e.Request, res:e.Response)=>{

			let s:ChatServer = SingletonObjectFactory2.Instance<ChatServer>(ChatServer.name);
			let receivers:string[] = await s.getReceives(null);
			res.json({receivers:receivers});
		});

		this.router.get('/groupByRoom',async (req:e.Request, res:e.Response)=>{

			let s:ChatServer = SingletonObjectFactory2.Instance<ChatServer>(ChatServer.name);
			let group:Map<string,string[]> = new Map();
			if(s){
				group = await s.getReceivesGroupByRoomId();
			}

			res.json({all:group});
		});

		this.router.get('/sockets',async (req:e.Request, res:e.Response)=>{

			let s:ChatServer = SingletonObjectFactory2.Instance<ChatServer>(ChatServer.name);
			let all:RemoteSocket<any,any>[] = await s.getSockets();
			all.map((socket:RemoteSocket<any,any>)=>{
				//socket.
			});
			res.json({all:all});
		});

		this.router.get('/close',async (req:e.Request, res:e.Response)=>{

			let s:ChatServer = SingletonObjectFactory2.Instance<ChatServer>(ChatServer.name);
			await s.close();
			res.json({ok:true});
		});

		return this.router
	}

}