
import {Request, Response, Router} from "express";
import {Logger} from "log4js";
import ChatClientProperties from "../../open/badman/chatt/client/ChatClientProperties";
import TalkAbout, {Copy} from "../../open/badman/chatt/entity/TalkAbout";
import MyClient from "./MyClient";


export default class ChatRouter {

	router:Router;

	logger:Logger;


	rooms:Map<string,string[]> = new Map<string, string[]>();
	all:Map<string,MyClient> = new Map<string, MyClient>();

	constructor(logger:Logger) {
		this.logger = logger;
		this.router = Router();
	}

	binds():Router{

		this.router.get('/login/:n',(req, res:Response)=>{

			let clientName:string = req.params.n;
			let properties:Partial<ChatClientProperties> = {
				addTrailingSlash: true,
				autoUnref: true,
				path: "/chatServer",
				reconnectionAttempts: 10,
				transports: ["polling"],
				upgrade: false,
				protocols: ['http', 'https']
			}

			let c:MyClient = new MyClient(clientName,'http://localhost:8888',this.logger,properties);

			this.all.set(clientName,c);

			res.json({"login":true});
			res.end();

		});


		this.router.get('/join/:n/:r/',(req, res:Response)=>{

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

		this.router.get('/leave/:n/:r/',(req, res:Response)=>{

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

		this.router.post('/group/:from/talking/:to',(req, res:Response)=>{

			let from:string = req.params.from;

			let to:string = req.params.to;

			let client:MyClient = this.all.get(from);

			let talkAbout:TalkAbout = Copy(req.body); //new TalkAbout(null,null,null);
			talkAbout.setNewsId(+Date.now());
			talkAbout.setRoomIds([to]);
			talkAbout.setSender(from);
			talkAbout.setSenderName(from);
			talkAbout.setState(false);
			//talkAbout.setContent(req.body.content);

			client.talkTo(talkAbout);

			res.json({"talked":true});

		});

		this.router.post('/private/:from/talking/:to',(req, res:Response)=>{

			let from:string = req.params.from;
			let to:string = req.params.to;
			let client:MyClient = this.all.get(from);
			let talkAbout:TalkAbout = Copy(req.body); //new TalkAbout(null,null,null);
			talkAbout.setNewsId(+Date.now());
			talkAbout.setReceiver(to);
			talkAbout.setSender(from);
			talkAbout.setSenderName(from);
			talkAbout.setState(false);
			//talkAbout.setContent(req.body.content);
			client.talkTo(talkAbout);
			res.json({"talked":true});
		});



		this.router.post('/rooms',(req:Request, res:Response)=>{
			let data = {};
			this.rooms.forEach((value, key) => {
				data[key] = value;
			});
			res.json({"rooms":data});
		});

		return this.router
	}

}