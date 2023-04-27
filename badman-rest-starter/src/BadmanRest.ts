

import {Logging, SingletonObjectFactory2} from "badman-core";
import {Logger} from "log4js";
import AxiosHttpClientRequestFactory from "./open/badman/rest/clients/axios/AxiosHttpClientRequestFactory";
import HttpClientResponse from "./open/badman/rest/HttpClientResponse";
import RestTemplate from "./open/badman/rest/RestTemplate";
import HttpClientRequest from "./open/badman/rest/HttpClientRequest";
import HttpClientRequestFactory from "./open/badman/rest/HttpClientRequestFactory";
import HttpProperties from "./open/badman/rest/HttpProperties";
import {HttpMethod} from "./open/badman/rest/HttpMethod";

export {
	AxiosHttpClientRequestFactory,
	HttpClientResponse,
	RestTemplate,
	HttpClientRequest,
	HttpClientRequestFactory,
	HttpMethod,
	HttpProperties
}

class BadmanRest {


	async main(){


		let logger:Logger = (await SingletonObjectFactory2.initWithArgs<Logging>(Logging,['log4js_properties.json'])).logger(BadmanRest.name);

		let rest:RestTemplate =  await SingletonObjectFactory2.initWithArgs<RestTemplate>(RestTemplate,[new AxiosHttpClientRequestFactory({
			responseType:'arraybuffer'
		})]);

		// let response:HttpClientResponse = await rest.post<Object,Object>('http://192.168.1.27:6999/testA',JSON.stringify({ss:'sssss'}));

		let response:HttpClientResponse = await rest.get<Object,ArrayBuffer>('http://192.168.1.11:6999/emergency_application/testB',{aaa:'sssss'});
		logger.debug(typeof response.body());
		logger.debug(response.body<Buffer>().toString());

	}

}

// (function(){
//
// 	new BadmanRest().main();
//
// })()


