

import {ServerOptions} from "ws";


export default interface WebSocketServerProperties extends ServerOptions{

	context:string;

	heartBeatInterval: number;
}