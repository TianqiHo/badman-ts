

import {Logging, SingletonObjectFactory2} from "badman-core";
import {AxiosHttpClientRequestFactory, HttpClientResponse, HttpMethod, RestTemplate} from "badman-rest-starter";

import * as console from "console";
import NacosDiscovery from "./open/badman/discovery/nacos/NacosDiscovery";
import NacosInstanceProperties from "./open/badman/discovery/nacos/NacosInstanceProperties";
import NacosRest from "./open/badman/discovery/nacos/NacosRest";
import NacosServerProperties from "./open/badman/discovery/nacos/NacosServerProperties";
import RestRequestParam from "./open/badman/discovery/nacos/RestRequestParam";


class BadmanNacosDiscovery {

	async main(){

		await SingletonObjectFactory2.init<Logging>(Logging);

		let serverProperties:NacosServerProperties = {
			logger: console, namespace: "dev", serverList: ["localhost:8848"],thisServerPort:1000,thisServerName:'Test'
		}

		let nacosDiscovery:NacosDiscovery = await SingletonObjectFactory2.initWithArgs<NacosDiscovery>(NacosDiscovery,[false,serverProperties]);

		let restTemplate:RestTemplate = await SingletonObjectFactory2.initWithArgs<RestTemplate>(RestTemplate,[new AxiosHttpClientRequestFactory({
			responseType: 'json'
		})]);

		let nacosRest:NacosRest = await SingletonObjectFactory2.init<NacosRest>(NacosRest);

		let request:RestRequestParam<Object> = {
			serviceName:'application',
			uri:'/testB',
			method: HttpMethod.GET,
			param: {aaa:'aaaaaaa'},
			serviceNameForPath:true
		};

		let response:HttpClientResponse = await nacosRest.execute<Object,string>(request);
		console.info(response.body<string>());

		// console.info(await nacosDiscovery.obtainInstance(nacosInstanceProperties));

	}
}


// (async function () {
// 	await (new BadmanNacosDiscovery()).main();
// })();


export {NacosServerProperties,NacosDiscovery,NacosInstanceProperties,NacosRest,RestRequestParam};