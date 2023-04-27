


import {ClientOptions} from "ws";


export default interface WebSocketClientProperties extends ClientOptions{


	heartBeatInterval: number;

}