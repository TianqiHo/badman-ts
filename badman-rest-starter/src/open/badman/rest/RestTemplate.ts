

import {Disposable, Initializing, Logging, SingletonObjectFactory2} from "badman-core";
import {Logger} from "log4js";
import HttpClientRequest from "./HttpClientRequest";
import HttpClientRequestFactory from "./HttpClientRequestFactory";
import HttpClientResponse from "./HttpClientResponse";
import {HttpMethod} from "./HttpMethod";
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


	async post<RequestDataType,ResponseDataType> (url: string, param: RequestDataType): Promise<HttpClientResponse> {
		let httpClientRequest:HttpClientRequest =  await this.httpClientRequestFactory.createRequest<RequestDataType>(url,param,HttpMethod.POST);
		let httpClientResponse:HttpClientResponse = await httpClientRequest.execute<RequestDataType,ResponseDataType>();
		return httpClientResponse;
	}

	async get<RequestDataType, ResponseDataType> (url: string, param: RequestDataType): Promise<HttpClientResponse> {
		let httpClientRequest:HttpClientRequest =  await this.httpClientRequestFactory.createRequest<RequestDataType>(url,param,HttpMethod.GET);
		let httpClientResponse:HttpClientResponse = await httpClientRequest.execute<RequestDataType,ResponseDataType>();
		return httpClientResponse;
	}
}