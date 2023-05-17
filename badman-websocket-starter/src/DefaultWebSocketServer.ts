

import {Logger} from "log4js";
import WebSocket from "ws";
import DefaultClientConnection from "./DefaultClientConnection";
import AbstractWebSocketServer from "./open/badman/websocket/AbstractWebSocketServer";
import RequestBodyEntity from "./open/badman/websocket/RequestBodyEntity";
import WebSocketServerProperties from "./open/badman/websocket/WebSocketServerProperties";

export default class DefaultWebSocketServer extends AbstractWebSocketServer<RequestBodyEntity,DefaultClientConnection>{

	constructor (serverProperties:WebSocketServerProperties,logger:Logger) {
		super(serverProperties,logger);
	}
	protected canDeleteConnection (connection: DefaultClientConnection) :boolean{
		return true;
	}

	protected newConnection (requestBody: RequestBodyEntity, ws: WebSocket): DefaultClientConnection {

		return new DefaultClientConnection(this,ws,requestBody);
	}

}