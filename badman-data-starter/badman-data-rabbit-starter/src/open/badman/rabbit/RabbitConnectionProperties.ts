

export default interface RabbitConnectionProperties{

	protocol?: string | undefined;
	/**
	 * Hostname used for connecting to the server.
	 *
	 * Default value: 'localhost'
	 */
	hostname?: string | undefined;
	/**
	 * Port used for connecting to the server.
	 *
	 * Default value: 5672
	 */
	port?: number | undefined;
	/**
	 * Username used for authenticating against the server.
	 *
	 * Default value: 'guest'
	 */
	username?: string | undefined;
	/**
	 * Password used for authenticating against the server.
	 *
	 * Default value: 'guest'
	 */
	password?: string | undefined;
	/**
	 * The desired locale for error messages. RabbitMQ only ever uses en_US
	 *
	 * Default value: 'en_US'
	 */
	locale?: string | undefined;
	/**
	 * The size in bytes of the maximum frame allowed over the connection. 0 means
	 * no limit (but since frames have a size field which is an unsigned 32 bit integer, it’s perforce 2^32 - 1).
	 *
	 * Default value: 0x1000 (4kb) - That's the allowed minimum, it will fit many purposes
	 */
	frameMax?: number | undefined;
	/**
	 * The period of the connection heartbeat in seconds.
	 *
	 * Default value: 0
	 */
	heartbeat?: number | undefined;
	/**
	 * What VHost shall be used.
	 *
	 * Default value: '/'
	 */
	vhost?: string | undefined;
	channelMax?:number;

}