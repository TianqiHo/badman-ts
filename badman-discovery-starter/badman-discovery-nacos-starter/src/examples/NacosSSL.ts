import {Logging, SingletonObjectFactory2} from "badman-core";
import {AxiosHttpClientRequestFactory, HttpClientResponse, HttpMethod, RestTemplate} from "badman-rest-starter";
import {Configuration} from "log4js";
import NacosDiscovery from "../open/badman/discovery/nacos/NacosDiscovery";
import NacosRest from "../open/badman/discovery/nacos/NacosRest";
import NacosServerProperties from "../open/badman/discovery/nacos/NacosServerProperties";
import RestRequestParam from "../open/badman/discovery/nacos/RestRequestParam";


export default class NacosSSL {

	async main(){

		let defaultConfiguration:Configuration = {
			"appenders": {
				"stdout_appender": {
					"type": "stdout",
					"layout": { "type": "pattern","pattern":"%[[CDPID(%z)]-[%d{yyyy-MM-dd hh:mm:ss.SSS} %c-%p] [%f{1}<%A>.%M(%l)] %] <=> %m %n" }
				}
			},
			"categories": {
				"default": {
					"appenders": ["stdout_appender"],
					"level": "debug",
					"enableCallStack": true
				}
			}
		};

		let logging:Logging = await SingletonObjectFactory2.initWithArgs<Logging>(Logging,[defaultConfiguration]);
		let logger = logging.logger();
		let serverProperties:Partial<NacosServerProperties> = {
			ssl:true,
			logger: logger,
			namespace: "8d0c090e-ddcb-420a-8967-532515f2cf5f",
			serverList: ["localhost:443"],
			thisServerPort:1000,
			thisServerName:'Test'
		}

		let nacosDiscovery:NacosDiscovery = await SingletonObjectFactory2.initWithArgs<NacosDiscovery>(NacosDiscovery,[true,serverProperties]);
		await nacosDiscovery.subscribeInstance("emer-im");

		let restTemplate:RestTemplate = await SingletonObjectFactory2.initWithArgs<RestTemplate>(RestTemplate,[new AxiosHttpClientRequestFactory({
			responseType: 'json'
		})]);

		let nacosRest:NacosRest = await SingletonObjectFactory2.init<NacosRest>(NacosRest);

		let header:Map<string,string> = new Map<string, string>();
		header.set('timeout','10000');
		header.set('user',JSON.stringify({id:'0941e0fab4f94c69aee15d7dbe14a455',code:'admin@saas',name:'adminstrotor',avatarUri:null,tenant:{code:'00000000',name:'SAAS'}}));

		let request:RestRequestParam<Object> = {
			serviceName:'emer-im',
			groupName: 'DEFAULT_GROUP',
			uri:'/server/allClients',
			method: HttpMethod.GET,
			serviceNameForPath:true,
			header : header
		};

		let response:HttpClientResponse = await nacosRest.execute<Object,string>(request);
		console.info(response.body<string>());

		setTimeout(()=>{
			nacosDiscovery.destroy();
		},15000);

		//
		// let request:RestRequestParam<Object> = {
		// 	serviceName:'application',
		// 	uri:'/testB',
		// 	method: HttpMethod.GET,
		// 	param: {aaa:'aaaaaaa'},
		// 	serviceNameForPath:true
		// };
		//
		// let response:HttpClientResponse = await nacosRest.execute<Object,string>(request);
		// console.info(response.body<string>());

		// console.info(await nacosDiscovery.obtainInstance(nacosInstanceProperties));

	}

}

(async function () {
	await (new NacosSSL()).main();
})();
