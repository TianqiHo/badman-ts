


import {Axios, AxiosError, AxiosRequestConfig, AxiosResponse, HttpStatusCode} from "axios";
import {Logger} from "log4js";
import HttpClientRequest from "../../HttpClientRequest";
import HttpClientResponse from "../../HttpClientResponse";
import AxiosHttpClientResponse from "./AxiosHttpClientResponse";


export default class AxiosHttpClientRequest implements HttpClientRequest{


	private axios:Axios;

	private readonly request:AxiosRequestConfig;

	private logger:Logger;

	constructor (axios:Axios,request:AxiosRequestConfig,logger:Logger) {
		this.axios = axios;
		this.request = request;
		this.logger = logger;
	}

	async execute<RequestDataType,ResponseDataType>(): Promise<HttpClientResponse> {
		try {
			this.logger.trace('Executing a request , and seeing the whole configuration. ',this.request);
			let response: any = await this.axios.request<ResponseDataType, AxiosResponse<ResponseDataType,RequestDataType>, RequestDataType>(this.request);

			if(response){
				if(response instanceof AxiosError){
					let err:AxiosError = response;
					this.logger.error(err.message,err);
					return new AxiosHttpClientResponse({
						status : HttpStatusCode.InternalServerError,
						statusText: err.code,
						headers: null,
						config: null,
						data: null
					});
				}else {
					let r:AxiosResponse<ResponseDataType> = <AxiosResponse<ResponseDataType>> response;
					this.logger.debug('Receiving a response, ',r);
					return new AxiosHttpClientResponse(r);
				}
			}else{
				this.logger.error('Receiving an empty response');
				return new AxiosHttpClientResponse({
					status : HttpStatusCode.Ok,
					statusText: 'OK',
					headers: null,
					config: null,
					data: null
				});
			}

		} catch (e) {
			this.logger.error('Executing Error ->',e);
			if(e instanceof AxiosError){
				let errResponse:AxiosResponse = {
					status : HttpStatusCode.BadRequest,
					statusText: ` - ${e.code} - ${e.message}`,
					headers: null,
					config: e.config,
					data: `${e.code} - ${e.message}`
				}
				return new AxiosHttpClientResponse(errResponse);
			}else{
				let errResponse:AxiosResponse = {
					status : HttpStatusCode.InternalServerError,
					statusText: `Framework Error - ${e.message}`,
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