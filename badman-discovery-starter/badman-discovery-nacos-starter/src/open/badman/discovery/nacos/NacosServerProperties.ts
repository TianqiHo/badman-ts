


export default interface NacosServerProperties {

	logger: any;//typeof console;
	serverList: string | string[];
	namespace: string;
	httpclient:any;

	endpoint:string;
	ssl:boolean;
	username:string;
	password:string;

	vipSrvRefInterMillis:number;
	ak: string;
	sk: string;

	thisServerIp?:string;
	thisServerPort?:number;
	thisServerName?:string;
}