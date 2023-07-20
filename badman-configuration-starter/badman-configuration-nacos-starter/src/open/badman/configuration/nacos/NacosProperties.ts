

import {ClientOptions} from "nacos-config";


export default interface NacosProperties extends ClientOptions{

	username:string;
	password:string;

	// whether use sub
	subscribed?:boolean;

	/**
	 * like below:
	 *    'const refresh = (newContent) => {\n' +
	 * 			//'  console.log(\'receive : \',newContent);\n' +
	 * 			'  if(newContent){process.exit(9000);}\n' +
	 * 			'}\n' +
	 * 	   'return {refresh};'
	 *
	 * 	   methodName must be 'refresh'.
	 */
	subscribeScript?:string;

	//using for skip the first system subscribe
	skipFirstSubscribeDelaySeconds?:number;

}