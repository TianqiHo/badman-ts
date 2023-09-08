

import {Disposable, Initializing} from "badman-core";
import {Logger} from "log4js";
import HttpClientRequest from "./HttpClientRequest";
import HttpClientRequestFactory from "./HttpClientRequestFactory";
import HttpClientResponse from "./HttpClientResponse";
import {HttpMethod} from "./HttpMethod";
import HttpProperties from "./HttpProperties";
import RestCommands from "./RestCommands";



export default class RestTemplate implements RestCommands,Initializing,Disposable{

	private logger:Logger;

	private httpClientRequestFactory:HttpClientRequestFactory;

	constructor (httpClientRequestFactory:HttpClientRequestFactory,logger:Logger) {
		this.logger = logger;
		this.httpClientRequestFactory = httpClientRequestFactory;
	}


	async afterInitialized () {
		return;
	}

	async destroy () {
		return;
	}


	async execute<RequestDataType, ResponseDataType> (url: string, method: HttpMethod, param: RequestDataType, custom?:HttpProperties): Promise<HttpClientResponse> {
		let httpClientRequest:HttpClientRequest =  await this.httpClientRequestFactory.createRequest<RequestDataType>(url,param,method,custom);
		let httpClientResponse:HttpClientResponse = await httpClientRequest.execute<RequestDataType,ResponseDataType>();
		return httpClientResponse;
	}

	async post<RequestDataType,ResponseDataType> (url: string, param: RequestDataType, custom?:Map<string,string | string[] | number | boolean>|HttpProperties): Promise<HttpClientResponse> {
		return this.execute<RequestDataType,ResponseDataType>(url,HttpMethod.POST, param, this.normalizeRequestConfiguration(custom));
	}

	async get<RequestDataType, ResponseDataType> (url: string, param: RequestDataType, custom?:Map<string,string | string[] | number | boolean>|HttpProperties): Promise<HttpClientResponse> {
		return this.execute<RequestDataType,ResponseDataType>(url,HttpMethod.GET, param, this.normalizeRequestConfiguration(custom));
	}

	async put<RequestDataType, ResponseDataType> (url: string, param: RequestDataType, custom?:Map<string,string | string[] | number | boolean>|HttpProperties): Promise<HttpClientResponse> {
		return this.execute<RequestDataType,ResponseDataType>(url,HttpMethod.PUT, param, this.normalizeRequestConfiguration(custom));
	}

	async delete<RequestDataType, ResponseDataType> (url: string, param: RequestDataType, custom?:Map<string,string | string[] | number | boolean>|HttpProperties): Promise<HttpClientResponse> {
		return this.execute<RequestDataType,ResponseDataType>(url,HttpMethod.DELETE, param, this.normalizeRequestConfiguration(custom));
	}


	/**
	 * using for the newest config for customer
	 * @param custom
	 * @private
	 */
	private normalizeRequestConfiguration(custom?:Map<string,string | string[] | number | boolean>|HttpProperties){
		let configuration:unknown ;
		if(custom instanceof Map){
			this.logger.debug(' Normalizing header map',custom);
			let t:HttpProperties = {headers:custom};
			configuration = t;
		}else{
			configuration = custom;
			this.logger.debug(' Normalizing properties ',custom);
		}
		return configuration;

	}
}