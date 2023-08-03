import {Logging, SingletonObjectFactory2} from "badman-core";
import {Logger} from "log4js";
import AxiosHttpClientRequestFactory from "../open/badman/rest/clients/axios/AxiosHttpClientRequestFactory";
import HttpClientResponse from "../open/badman/rest/HttpClientResponse";
import RestTemplate from "../open/badman/rest/RestTemplate";


export default class Test {

	async main(){


		let logger:Logger = (await SingletonObjectFactory2.initWithArgs<Logging>(Logging,['../../log4js_properties.json'])).logger(Test.name);

		let rest:RestTemplate =  await SingletonObjectFactory2.initWithArgs<RestTemplate>(RestTemplate,[new AxiosHttpClientRequestFactory({
			responseType:'arraybuffer'
		}),logger]);

		// let response:HttpClientResponse = await rest.post<Object,Object>('http://192.168.1.27:6999/testA',JSON.stringify({ss:'sssss'}));

		//let response:HttpClientResponse = await rest.get<Object,ArrayBuffer>('http://192.168.1.11:6999/emergency_application/testB',{aaa:'sssss'});

		let header:Map<string,string> = new Map<string, string>();
		header.set('timeout','10000');
		header.set('user',"{id:\'0941e0fab4f94c69aee15d7dbe14a455\',code:\'admin@saas\',name:\'adminstrotor\',avatarUri:null,tenant:{code:\'00000000\',name:\'SAAS\'}}");

		let response:HttpClientResponse = await rest.post<Object,ArrayBuffer>('http://192.168.1.32:5999/emerIM/message/100/unReaders',{aaa:'sssss'},header);
		logger.debug(typeof response.body());
		logger.debug(response.body<Buffer>().toString());

	}

}

(function (aaa:string) {

	new Test().main();

})('Test');