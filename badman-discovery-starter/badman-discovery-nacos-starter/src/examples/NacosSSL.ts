import {Logging, SingletonObjectFactory2} from "badman-core";
import {Configuration} from "log4js";
import NacosDiscovery from "../open/badman/discovery/nacos/NacosDiscovery";
import NacosServerProperties from "../open/badman/discovery/nacos/NacosServerProperties";


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
			namespace: "d903a6c3-7300-4f06-83a7-c74f87d8fe7e",
			serverList: ["localhost.com.cn:443"],
			//endpoint: "nacos.anmed.com.cn",
			thisServerPort:1000,
			thisServerName:'Test'
		}

		let nacosDiscovery:NacosDiscovery = await SingletonObjectFactory2.initWithArgs<NacosDiscovery>(NacosDiscovery,[true,serverProperties]);
		nacosDiscovery.subscribeInstance("s1");

		// let restTemplate:RestTemplate = await SingletonObjectFactory2.initWithArgs<RestTemplate>(RestTemplate,[new AxiosHttpClientRequestFactory({
		// 	responseType: 'json'
		// })]);
		//
		// let nacosRest:NacosRest = await SingletonObjectFactory2.init<NacosRest>(NacosRest);
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
//
// (async function () {
// 	await (new NacosSSL()).main();
// })();
