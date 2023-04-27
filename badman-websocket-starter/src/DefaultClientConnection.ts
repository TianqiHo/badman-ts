

import {Logging, SingletonObjectFactory2} from "badman-core";
import {Logger} from "log4js";
import WebSocket from "ws";
import AbstractWebSocketServerConnection from "./open/badman/websocket/AbstractWebSocketServerConnection";
import RequestBodyEntity from "./open/badman/websocket/RequestBodyEntity";
import WebSocketServerProperties from "./open/badman/websocket/WebSocketServerProperties";

export default class DefaultClientConnection extends AbstractWebSocketServerConnection<RequestBodyEntity>{

	private logger:Logger;

	constructor (serverProperties:WebSocketServerProperties,ws: WebSocket, requestBody: RequestBodyEntity) {
		super(serverProperties,ws, requestBody);
		this.logger = SingletonObjectFactory2.Instance<Logging>(Logging.name).logger(DefaultClientConnection.name);
	}


	notifyClientCustomized () {
		this.sendMessage("DefaultClientConnectionDefaultClientConnectionDefaultClientConnectionDefaultClientConnection");
	}

	onMessage (msg:Buffer) {

		console.info('-------------------------------------',msg.toString());
		this.logger.info(msg.toString());
	}

}