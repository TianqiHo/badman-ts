

import WebSocketClientProperties from "./WebSocketClientProperties";
import WebSocketServerProperties from "./WebSocketServerProperties";


export default interface WebSocketProperties{

	/**
	 * 服务端配置
	 */
	serverProperties:WebSocketServerProperties;

	/**
	 * 客户端配置
	 */
	clientProperties?:WebSocketClientProperties;

}


