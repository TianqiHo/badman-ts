

export default interface ChatClientProperties {

	/**
	 * Should we force a new Manager for this connection?
	 * @default false
	 */
	forceNew: boolean;
	/**
	 * Should we multiplex our connection (reuse existing Manager) ?
	 * @default true
	 */
	multiplex: boolean;
	/**
	 * The path to get our client file from, in the case of the server
	 * serving it
	 * @default '/socket.io'
	 */
	path: string;
	/**
	 * Should we allow reconnections?
	 * @default true
	 */
	reconnection: boolean;
	/**
	 * How many reconnection attempts should we try?
	 * @default Infinity
	 */
	reconnectionAttempts: number;
	/**
	 * The time delay in milliseconds between reconnection attempts
	 * @default 1000
	 */
	reconnectionDelay: number;
	/**
	 * The max time delay in milliseconds between reconnection attempts
	 * @default 5000
	 */
	reconnectionDelayMax: number;
	/**
	 * Used in the exponential backoff jitter when reconnecting
	 * @default 0.5
	 */
	randomizationFactor: number;
	/**
	 * The timeout in milliseconds for our connection attempt
	 * @default 20000
	 */
	timeout: number;
	/**
	 * Should we automatically connect?
	 * @default true
	 */
	autoConnect: boolean;
	/**
	 * the parser to use. Defaults to an instance of the Parser that ships with socket.io.
	 */
	parser: any;

	/**
	 * The host that we're connecting to. Set from the URI passed when connecting
	 */
	host: string;
	/**
	 * The hostname for our connection. Set from the URI passed when connecting
	 */
	hostname: string;
	/**
	 * If this is a secure connection. Set from the URI passed when connecting
	 */
	secure: boolean;
	/**
	 * The port for our connection. Set from the URI passed when connecting
	 */
	port: string | number;
	/**
	 * Any query parameters in our uri. Set from the URI passed when connecting
	 */
	query: {
		[key: string]: any;
	};
	/**
	 * `http.Agent` to use, defaults to `false` (NodeJS only)
	 */
	agent: string | boolean;
	/**
	 * Whether the client should try to upgrade the transport from
	 * long-polling to something better.
	 * @default true
	 */
	upgrade: boolean;
	/**
	 * Forces base 64 encoding for polling transport even when XHR2
	 * responseType is available and WebSocket even if the used standard
	 * supports binary.
	 */
	forceBase64: boolean;
	/**
	 * The param name to use as our timestamp key
	 * @default 't'
	 */
	timestampParam: string;
	/**
	 * Whether to add the timestamp with each transport request. Note: this
	 * is ignored if the browser is IE or Android, in which case requests
	 * are always stamped
	 * @default false
	 */
	timestampRequests: boolean;
	/**
	 * A list of transports to try (in order). Engine.io always attempts to
	 * connect directly with the first one, provided the feature detection test
	 * for it passes.
	 * @default ['polling','websocket']
	 */
	transports: string[];
	/**
	 * If true and if the previous websocket connection to the server succeeded,
	 * the connection attempt will bypass the normal upgrade process and will
	 * initially try websocket. A connection attempt following a transport error
	 * will use the normal upgrade process. It is recommended you turn this on
	 * only when using SSL/TLS connections, or if you know that your network does
	 * not block websockets.
	 * @default false
	 */
	rememberUpgrade: boolean;
	/**
	 * Are we only interested in transports that support binary?
	 */
	onlyBinaryUpgrades: boolean;
	/**
	 * Timeout for xhr-polling requests in milliseconds (0) (only for polling transport)
	 */
	requestTimeout: number;
	/**
	 * Transport options for Node.js client (headers etc)
	 */
	transportOptions: Object;
	/**
	 * (SSL) Certificate, Private key and CA certificates to use for SSL.
	 * Can be used in Node.js client environment to manually specify
	 * certificate information.
	 */
	pfx: string;
	/**
	 * (SSL) Private key to use for SSL. Can be used in Node.js client
	 * environment to manually specify certificate information.
	 */
	key: string;
	/**
	 * (SSL) A string or passphrase for the private key or pfx. Can be
	 * used in Node.js client environment to manually specify certificate
	 * information.
	 */
	passphrase: string;
	/**
	 * (SSL) Public x509 certificate to use. Can be used in Node.js client
	 * environment to manually specify certificate information.
	 */
	cert: string;
	/**
	 * (SSL) An authority certificate or array of authority certificates to
	 * check the remote host against.. Can be used in Node.js client
	 * environment to manually specify certificate information.
	 */
	ca: string | string[];
	/**
	 * (SSL) A string describing the ciphers to use or exclude. Consult the
	 * [cipher format list]
	 * (http://www.openssl.org/docs/apps/ciphers.html#CIPHER_LIST_FORMAT) for
	 * details on the format.. Can be used in Node.js client environment to
	 * manually specify certificate information.
	 */
	ciphers: string;
	/**
	 * (SSL) If true, the server certificate is verified against the list of
	 * supplied CAs. An 'error' event is emitted if verification fails.
	 * Verification happens at the connection level, before the HTTP request
	 * is sent. Can be used in Node.js client environment to manually specify
	 * certificate information.
	 */
	rejectUnauthorized: boolean;
	/**
	 * Headers that will be passed for each request to the server (via xhr-polling and via websockets).
	 * These values then can be used during handshake or for special proxies.
	 */
	extraHeaders?: {
		[header: string]: string;
	};
	/**
	 * Whether to include credentials (cookies, authorization headers, TLS
	 * client certificates, etc.) with cross-origin XHR polling requests
	 * @default false
	 */
	withCredentials: boolean;
	/**
	 * Whether to automatically close the connection whenever the beforeunload event is received.
	 * @default true
	 */
	closeOnBeforeunload: boolean;
	/**
	 * Whether to always use the native timeouts. This allows the client to
	 * reconnect when the native timeout functions are overridden, such as when
	 * mock clocks are installed.
	 * @default false
	 */
	useNativeTimers: boolean;
	/**
	 * weather we should unref the reconnect timer when it is
	 * create automatically
	 * @default false
	 */
	autoUnref: boolean;
	/**
	 * parameters of the WebSocket permessage-deflate extension (see ws module api docs). Set to false to disable.
	 * @default false
	 */
	perMessageDeflate: {
		threshold: number;
	};

	/**
	 * Whether we should add a trailing slash to the request path.
	 * @default true
	 */
	addTrailingSlash: boolean;
	/**
	 * Either a single protocol string or an array of protocol strings. These strings are used to indicate sub-protocols,
	 * so that a single server can implement multiple WebSocket sub-protocols (for example, you might want one server to
	 * be able to handle different types of interactions depending on the specified protocol)
	 * @default []
	 */
	protocols: string | string[];


	/**
	 * the authentication payload sent when connecting to the Namespace
	 */
	auth?: {
		[key: string]: any;
	} | ((cb: (data: object) => void) => void);
	/**
	 * The maximum number of retries. Above the limit, the packet will be discarded.
	 *
	 * Using `Infinity` means the delivery guarantee is "at-least-once" (instead of "at-most-once" by default), but a
	 * smaller value like 10 should be sufficient in practice.
	 */
	retries?: number;
	/**
	 * The default timeout in milliseconds used when waiting for an acknowledgement.
	 */
	ackTimeout?: number;

}