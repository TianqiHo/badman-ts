

import {IncomingMessage, Server as HTTPServer} from "http";
import {Server as HTTPSServer} from "https";
import {PerMessageDeflateOptions, VerifyClientCallbackAsync, VerifyClientCallbackSync} from "ws";


export default interface WebSocketServerProperties{

	context?:string; //context path either one
	host?: string | undefined;
	port?: number | undefined;
	backlog?: number | undefined;
	server?: HTTPServer | HTTPSServer | undefined;
	verifyClient?: VerifyClientCallbackAsync | VerifyClientCallbackSync | undefined;
	handleProtocols?: (protocols: Set<string>, request: IncomingMessage) => string | false;
	path?: string | undefined;
	noServer?: boolean | undefined;
	clientTracking?: boolean | undefined;
	perMessageDeflate?: boolean | PerMessageDeflateOptions | undefined;
	maxPayload?: number | undefined;
	skipUTF8Validation?: boolean | undefined;

	heartBeatInterval: number;
}