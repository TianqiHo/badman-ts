
import dns from "node:dns";
import {UdpType} from "./AbstractUdp";


export default interface UdpProperties{


	port:number;

	address?:string;

	type: UdpType;

	/**
	 * 	When true socket.bind() will reuse the address, even if another process has already bound a socket on it. Default: false.
	 */
	reuseAddr?: boolean | undefined;

	/**
	 * Setting ipv6Only to true will disable dual-stack support, i.e., binding to address :: won't make 0.0.0.0 be bound. Default: false.
	 */
	ipv6Only?: boolean | undefined;

	recvBufferSize?: number | undefined;

	sendBufferSize?: number | undefined;

	/**
	 * Custom lookup function. Default: dns.lookup().
	 */
	lookup?: ((hostname: string, options: dns.LookupOneOptions, callback: (err: NodeJS.ErrnoException | null, address: string, family: number) => void) => void) | undefined;
}