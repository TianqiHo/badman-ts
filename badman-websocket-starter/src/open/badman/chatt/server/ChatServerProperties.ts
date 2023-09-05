
import {CookieSerializeOptions} from "cookie";
import {CorsOptions, CorsOptionsDelegate} from "cors";
import {IncomingMessage} from "http";
import {Adapter} from "socket.io-adapter";
import {Namespace} from "socket.io/dist/namespace";

declare type AdapterConstructor = typeof Adapter | ((nsp: Namespace) => Adapter);
declare type Transport = "polling" | "websocket";
export default interface ChatServerProperties{

	welcomeMessage:string;

	namespace:string;

	/**
	 * 服务端口
	 */
	port:number;

	/**
	 * name of the path to capture
	 * @default "/socket.io"
	 */
	path: string;
	/**
	 * whether to serve the client files
	 * @default true
	 */
	serveClient: boolean;
	/**
	 * the adapter to use
	 * @default the in-memory adapter (https://github.com/socketio/socket.io-adapter)
	 */
	adapter: AdapterConstructor;
	/**
	 * the parser to use
	 * @default the default parser (https://github.com/socketio/socket.io-parser)
	 */
	parser: any;
	/**
	 * The number of ms before disconnecting a client that has not successfully joined a namespace.
	 * @default 45000
	 */
	connectTimeout: number;
	/**
	 * Whether to enable the recovery of connection state when a client temporarily disconnects.
	 *
	 * The connection state includes the missed packets, the rooms the socket was in and the `data` attribute.
	 */
	connectionStateRecovery: {
		/**
		 * The backup duration of the sessions and the packets.
		 *
		 * @default 120000 (2 minutes)
		 */
		maxDisconnectionDuration?: number;
		/**
		 * Whether to skip middlewares upon successful connection state recovery.
		 *
		 * @default true
		 */
		skipMiddlewares?: boolean;
	};
	/**
	 * Whether to remove child namespaces that have no sockets connected to them
	 * @default false
	 */
	cleanupEmptyChildNamespaces: boolean;

	/**
	 * how many ms without a pong packet to consider the connection closed
	 * @default 20000
	 */
	pingTimeout?: number;
	/**
	 * how many ms before sending a new ping packet
	 * @default 25000
	 */
	pingInterval?: number;
	/**
	 * how many ms before an uncompleted transport upgrade is cancelled
	 * @default 10000
	 */
	upgradeTimeout?: number;
	/**
	 * how many bytes or characters a message can be, before closing the session (to avoid DoS).
	 * @default 1e5 (100 KB)
	 */
	maxHttpBufferSize?: number;
	/**
	 * A function that receives a given handshake or upgrade request as its first parameter,
	 * and can decide whether to continue or not. The second argument is a function that needs
	 * to be called with the decided information: fn(err, success), where success is a boolean
	 * value where false means that the request is rejected, and err is an error code.
	 */
	allowRequest?: (req: IncomingMessage, fn: (err: string | null | undefined, success: boolean) => void) => void;
	/**
	 * the low-level transports that are enabled
	 * @default ["polling", "websocket"]
	 */
	transports?: Transport[];
	/**
	 * whether to allow transport upgrades
	 * @default true
	 */
	allowUpgrades?: boolean;
	/**
	 * parameters of the WebSocket permessage-deflate extension (see ws module api docs). Set to false to disable.
	 * @default false
	 */
	perMessageDeflate?: boolean | object;
	/**
	 * parameters of the http compression for the polling transports (see zlib api docs). Set to false to disable.
	 * @default true
	 */
	httpCompression?: boolean | object;
	/**
	 * what WebSocket server implementation to use. Specified module must
	 * conform to the ws interface (see ws module api docs).
	 * An alternative c++ addon is also available by installing eiows module.
	 *
	 * @default `require("ws").Server`
	 */
	wsEngine?: any;
	/**
	 * an optional packet which will be concatenated to the handshake packet emitted by Engine.IO.
	 */
	initialPacket?: any;
	/**
	 * configuration of the cookie that contains the client sid to send as part of handshake response headers. This cookie
	 * might be used for sticky-session. Defaults to not sending any cookie.
	 * @default false
	 */
	cookie?: (CookieSerializeOptions & {
		name: string;
	}) | boolean;
	/**
	 * the options that will be forwarded to the cors module
	 */
	cors?: CorsOptions | CorsOptionsDelegate;
	/**
	 * whether to enable compatibility with Socket.IO v2 clients
	 * @default false
	 */
	allowEIO3?: boolean;

	/**
	 * destroy unhandled upgrade requests
	 * @default true
	 */
	destroyUpgrade?: boolean;
	/**
	 * milliseconds after which unhandled requests are ended
	 * @default 1000
	 */
	destroyUpgradeTimeout?: number;
	/**
	 * Whether we should add a trailing slash to the request path.
	 * @default true
	 */
	addTrailingSlash?: boolean;
}