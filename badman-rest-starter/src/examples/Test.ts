

import {Logging, SingletonObjectFactory2} from "badman-core";
import {Logger} from "log4js";
import AxiosHttpClientRequestFactory from "../open/badman/rest/clients/axios/AxiosHttpClientRequestFactory";
import HttpClientResponse from "../open/badman/rest/HttpClientResponse";
import HttpHeaders from "../open/badman/rest/HttpHeaders";
import HttpProperties from "../open/badman/rest/HttpProperties";
import RestTemplate from "../open/badman/rest/RestTemplate";

import configuration from "./log4js_properties.json"

export default class Test {

	async main(){


		let logger:Logger = (await SingletonObjectFactory2.initWithArgs<Logging>(Logging,[configuration])).logger(Test.name);

		let rest:RestTemplate =  await SingletonObjectFactory2.initWithArgs<RestTemplate>(RestTemplate,[new AxiosHttpClientRequestFactory({
			//responseType:'arraybuffer'
			responseType:'json'
		})]);

		let response:HttpClientResponse = await rest.get<Object,Buffer>('http://192.168.1.36:9999/sdy/test',{t:'ss222'});
		//logger.info('------',response);
		logger.info('',response.body<Buffer>().toString());

		//let response:HttpClientResponse = await rest.get<Object,ArrayBuffer>('http://192.168.1.11:6999/emergency_application/testB',{aaa:'sssss'});

		// let header:Map<string,string> = new Map<string, string>();
		// header.set('timeout','10000');
		// header.set('user',"{id:\'0941e0fab4f94c69aee15d7dbe14a455\',code:\'admin@saas\',name:\'adminstrotor\',avatarUri:null,tenant:{code:\'00000000\',name:\'SAAS\'}}");
		//
		// let response:HttpClientResponse = await rest.post<Object,ArrayBuffer>('http://192.168.1.32:5999/emerIM/message/100/unReaders',{aaa:'sssss'},header);
		// logger.debug(typeof response.body());
		// logger.debug(response.body<Buffer>().toString());

		let url:string = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials';
		// let p:Map<string,any> = new Map<string, any>();
		// p.set('timeout','10000');
		// let response1:HttpClientResponse = await rest.get<void,any>(url,null);
		//
		// let token:string = '';

		// let header:Map<string,string> = new Map();
		// header.set('Content-Type','application/x-www-form-urlencoded');
		//
		// let custom:HttpProperties = {
		// 	//responseType:'arraybuffer'
		// 	responseType:'json',
		// 	transformRequest:(data:unknown, headers:HttpHeaders) =>{
		// 		logger.debug('-----data--------',data);
		// 		logger.debug('---------headers----------',headers);
		// 		return data;
		// 	},
		// 	transformResponse:(data:unknown, headers:HttpHeaders,status:number)=>{
		// 		logger.debug('-----data--------',data);
		// 		logger.debug('---------headers----------',headers);
		// 		logger.debug('---------status----------',status);
		// 		return data;
		// 	},
		// 	headers:header
		// }
		//
		// let param:Map<string,any> = new Map<string, any>();
		// param.set('id_card_side','front');
		// param.set('image',null);
		//
		// let response:HttpClientResponse =
		// 	await rest.post<object,A>(`https://aip.baidubce.com/rest/2.0/ocr/v1/idcard?access_token=${token}`,param,custom);
		// let data:A = response.body<A>();
		// logger.info('---------re----------',data);

	}

}


interface A{

	log_id:string;
	error_msg:string;
	error_code:number;
}

(function (aaa:string) {

	new Test().main();

	// let header:Map<string,string> = new Map<string, string>();
	// header.set('timeout','10000');
	// header.set('user',"{id:\'0941e0fab4f94c69aee15d7dbe14a455\',code:\'admin@saas\',name:\'adminstrotor\',avatarUri:null,tenant:{code:\'00000000\',name:\'SAAS\'}}");
	//
	// console.info(typeof header);
	//
	// console.info(header instanceof Map);
	//
	// console.info(JSON.stringify(header));
})('Test');