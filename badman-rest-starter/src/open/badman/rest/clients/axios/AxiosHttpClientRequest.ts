


import {Axios, AxiosError, AxiosRequestConfig, AxiosResponse, HttpStatusCode} from "axios";
import {Logging, SingletonObjectFactory2} from "badman-core";
import {Logger} from "log4js";
import HttpClientRequest from "../../HttpClientRequest";
import HttpClientResponse from "../../HttpClientResponse";
import AxiosHttpClientResponse from "./AxiosHttpClientResponse";


export default class AxiosHttpClientRequest implements HttpClientRequest{


	private axios:Axios;

	private readonly request:AxiosRequestConfig;

	private logger:Logger;

	constructor (axios:Axios,request:AxiosRequestConfig) {
		this.axios = axios;
		this.request = request;
		this.logger = SingletonObjectFactory2.Instance<Logging>(Logging.name).logger(AxiosHttpClientRequest.name);
	}

	async execute<RequestDataType,ResponseDataType>(): Promise<HttpClientResponse> {
		try {
			this.logger.debug('Executing a request , and seeing the whole configuration. ',this.request);
			let response: AxiosResponse<ResponseDataType> = await this.axios.request<ResponseDataType, AxiosResponse<ResponseDataType,RequestDataType>, RequestDataType>(this.request);
			this.logger.debug('Receiving a response , it is ', response);
			return new AxiosHttpClientResponse(response);
		} catch (e) {
			this.logger.error('异常捕获 ->',e);
			if(e instanceof AxiosError){
				let errResponse:AxiosResponse = {
					status : HttpStatusCode.BadRequest,
					statusText: `框架未能发出请求 - ${e.code} - ${e.message}`,
					headers: null,
					config: e.config,
					data: `${e.code} - ${e.message}`
				}
				return new AxiosHttpClientResponse(errResponse);
			}else{
				let errResponse:AxiosResponse = {
					status : HttpStatusCode.InternalServerError,
					statusText: `框架异常 - ${e.message}`,
					headers: null,
					config: null,
					data: null
				}
				return new AxiosHttpClientResponse(errResponse);
			}
		}
		return ;
	}

}