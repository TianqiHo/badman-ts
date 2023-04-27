

The Configurable And Extensible WebsocketServer.

There are 2 important Classes, AbstractWebSocketServerConnection and AbstractWebSocketServer. The core.

Demo APIs :

    async main(){
		let logging:Logging = await SingletonObjectFactory2.init<Logging>(Logging);
		let logger:Logger = logging.logger(BadmanWebSocket.name);
		let properties:WebSocketServerProperties={
				port: 1000,
				context: 'custom',
				heartBeatInterval : 10000
		};
		new DefaultWebSocketServer(properties,logger).afterInitialized();
	}


----------------------------------------------------------------------------------------------------------------

    export default class DefaultWebSocketServer extends AbstractWebSocketServer<RequestBodyEntity,DefaultClientConnection>{

        constructor (serverProperties:WebSocketServerProperties,logger:Logger) {
            super(serverProperties,logger);
        }
        protected canDeleteConnection (connection: DefaultClientConnection) :boolean{
            return true;
        }
    
        protected newConnection (requestBody: RequestBodyEntity, ws: WebSocket): DefaultClientConnection {
            return new DefaultClientConnection(this.serverProperties,ws,requestBody);
        }

    }


----------------------------------------------------------------------------------------
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