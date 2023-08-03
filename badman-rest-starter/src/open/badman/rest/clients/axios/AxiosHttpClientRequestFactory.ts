

import {Axios, AxiosHeaders, AxiosRequestConfig} from "axios";
import {InstantiationAwarePostProcessor} from "badman-core";

import HttpClientRequest from "../../HttpClientRequest";
import HttpClientRequestFactory from "../../HttpClientRequestFactory";
import {HttpMethod} from "../../HttpMethod";
import HttpProperties from "../../HttpProperties";
import AxiosHttpClientRequest from "./AxiosHttpClientRequest";


export default class AxiosHttpClientRequestFactory implements HttpClientRequestFactory,InstantiationAwarePostProcessor{


	private readonly axios:Axios;

	constructor (properties?:HttpProperties) {

		let headers:AxiosHeaders = new AxiosHeaders();
		headers.setContentType('application/json; charset=utf-8');
		headers.set("Connection",'keep-alive');
		headers.set('Accept-Encoding','gzip, deflate, br',true);
		headers.setAccept('*/*');

		let defaultProperties:AxiosRequestConfig = {
			timeout: 5000,
			timeoutErrorMessage : 'custom timeout ',
			responseType: 'json',
			responseEncoding: 'UTF-8',
			maxBodyLength: 1024*1024,
			maxContentLength: 1024*1024,
			headers: headers,
			decompress:true
		}

		Object.assign(defaultProperties,properties);
		this.axios = new Axios(defaultProperties);
	}

	beforePostProcess () {

	}

	postProcess () {

	}

	afterPostProcess (instance: any) {

	}

	async createRequest<RequestDataType> (url: string, param: RequestDataType, method: HttpMethod, headerMap?:Map<string,string | string[] | number | boolean>): Promise<HttpClientRequest> {

		let headers:AxiosHeaders = new AxiosHeaders();
		if(headerMap.size>=1){
			headerMap.forEach((val:string,key:string)=>{
				headers.set(key,val);
			});
		}

		let request:AxiosRequestConfig ={
			url: url,
			method: method,
			headers: headers
		}

		switch (method) {
			case HttpMethod.GET || HttpMethod.get:
				request.params = param;
				break;

			case HttpMethod.POST || HttpMethod.post || HttpMethod.PUT
			     || HttpMethod.put || HttpMethod.DELETE || HttpMethod.delete
			     || HttpMethod.PATCH || HttpMethod.patch:
				request.data = typeof param === 'string' ? param : JSON.stringify(param);
				break;
		}
		return new AxiosHttpClientRequest(this.axios,request);
	}

}