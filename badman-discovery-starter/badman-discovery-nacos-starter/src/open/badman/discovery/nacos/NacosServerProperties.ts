


export default interface NacosServerProperties {

	logger: typeof console;
	serverList: string | string[];
	namespace?: string


	thisServerIp?:string;
	thisServerPort?:number;
	thisServerName?:string;
}