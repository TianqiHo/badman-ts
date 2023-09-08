
import {
	Axios,
	AxiosHeaders,
	AxiosRequestConfig,
	AxiosResponse,
	HeadersDefaults,
	InternalAxiosRequestConfig, RawAxiosRequestHeaders
} from "axios";
import {InstantiationAwarePostProcessor} from "badman-core";
import qs from 'querystring'
import {ContentType} from "../../ContentType";
import HttpClientRequest from "../../HttpClientRequest";
import HttpClientRequestFactory from "../../HttpClientRequestFactory";
import {HttpMethod} from "../../HttpMethod";
import HttpProperties from "../../HttpProperties";
import AxiosHttpClientRequest from "./AxiosHttpClientRequest";


export default class AxiosHttpClientRequestFactory implements HttpClientRequestFactory,InstantiationAwarePostProcessor{


	private readonly axios:Axios;


	constructor (properties?:HttpProperties) {

		let headers:AxiosHeaders = new AxiosHeaders();
		headers.setContentType(ContentType.APPLICATION_JSON_UTF8);
		headers.set("Connection",'keep-alive');
		headers.set('Accept-Encoding','gzip, deflate, br',true);
		headers.set('BadMan','forever');
		headers.setAccept('*/*');

		let defaultProperties:AxiosRequestConfig = {
			timeout: 5000,
			timeoutErrorMessage : 'request timeout ',
			responseType: 'json',
			responseEncoding: 'UTF-8',
			maxBodyLength: 1024*1024,
			maxContentLength: 1024*1024,
			headers: headers,
			decompress:true
		}

		Object.assign(defaultProperties,properties);
		this.axios = new Axios(defaultProperties);

		this.axios.interceptors.request.use((value:InternalAxiosRequestConfig)=>{
			return value;
		},(error:any)=>{
			return error;
		});

		this.axios.interceptors.response.use((response:AxiosResponse)=>{
			// let data:any = response.data;
			// if(typeof data === 'string' || Buffer.isBuffer(data)){
			//
			// }
			return response;
		},(error:any)=>{
			return error;
		});

	}

	beforePostProcess () {

	}

	postProcess () {

	}

	afterPostProcess (instance: any) {

	}

	async createRequest<RequestDataType> (url: string,
	                                      param: RequestDataType,
	                                      method: HttpMethod,
	                                      custom?:HttpProperties): Promise<HttpClientRequest> {

		let request:AxiosRequestConfig ={
			url: url,
			method: method
		}

		let headers:AxiosHeaders = new AxiosHeaders();
		headers.set('BadMan','forever');
		if(custom){
			let customHeadersMap = custom.headers;
			if(customHeadersMap && customHeadersMap.size >= 1){
				customHeadersMap.forEach((val:string,key:string)=>{
					headers.set(key,val);
				});
				custom.headers = null;
			}
		}
		let defaultHeaders:HeadersDefaults = this.axios.defaults.headers;
		request = Object.assign(request,defaultHeaders,custom,headers);

		let customContentType = headers.getContentType()?headers.getContentType():null;
		switch (method) {
			case HttpMethod.GET || HttpMethod.get:
				request.params = param;
				break;

			case HttpMethod.POST || HttpMethod.post:

				let contentType1:unknown = this.detectContentType(customContentType,defaultHeaders?defaultHeaders.post:null);
				request.data = this.formatParam(param,contentType1.toString());
				break;

			case HttpMethod.PUT || HttpMethod.put:
				let contentType2:unknown =  this.detectContentType(customContentType,defaultHeaders?defaultHeaders.put:null);
				request.data = this.formatParam(param,contentType2.toString());
				break;

			case HttpMethod.DELETE || HttpMethod.delete:
				let contentType3:unknown =  this.detectContentType(customContentType,defaultHeaders?defaultHeaders.delete:null);
				request.data = this.formatParam(param,contentType3.toString());
				break;

			case HttpMethod.PATCH || HttpMethod.patch:
				let contentType4:unknown =  this.detectContentType(customContentType,defaultHeaders?defaultHeaders.patch:null);
				request.data = this.formatParam(param,contentType4.toString());
				break;

			default:
				console.info('----------------UNTREATED PARAM-----------------------');
				break;
		}
		return new AxiosHttpClientRequest(this.axios,request);
	}

	private detectContentType(contentType:unknown,defaultMethodHeaders:RawAxiosRequestHeaders):unknown{

		if(contentType){
			return contentType;
		}

		if(defaultMethodHeaders){
			let defaultContentType:unknown = defaultMethodHeaders["Content-Type"];
			if(!defaultContentType){
				let defaultHeaders:HeadersDefaults =  this.axios.defaults.headers;
				if(defaultHeaders && defaultHeaders.common){
					defaultContentType = defaultHeaders.common["Content-Type"];
					if(defaultContentType){
						return defaultContentType;
					}
				}
			}else{
				return  defaultContentType;
			}
		}else{
			let defaultHeaders:HeadersDefaults =  this.axios.defaults.headers;
			let headers:RawAxiosRequestHeaders = (defaultHeaders.common && defaultHeaders.common['Content-Type'] ) || defaultHeaders['Content-Type'];
			if(headers){
				return headers;
			}
		}

		return ContentType.APPLICATION_JSON_UTF8;
	}

	private formatParam(param:unknown,contentType:string):string|unknown{

		if(!param){
			return null;
		}

		if(contentType === ContentType.APPLICATION_JSON
			|| contentType === ContentType.APPLICATION_JSON_UTF8){

			if(param instanceof Map){
				return JSON.stringify(this.map2object(param));
				//throw new Error('Param Map type can‘t be serialize to a json string.');
			}
			return typeof param === 'string' ? param : JSON.stringify(param);
		}

		if(contentType === ContentType.APPLICATION_X_WWW_FORM_URLENCODED
			// || contentTypeStr === ContentType.MULTIPART_FORM_DATA
			// || contentTypeStr === ContentType.APPLICATION_OCTET_STREAM
		){
			if(param instanceof Map){
				//let obj:any = Object.assign<any,Map<any,any>>({},param);
				return qs.stringify(this.map2object(param));
			}
			// @ts-ignore
			return qs.stringify(param);
		}

		return param;
	}

	private map2object(map:Map<any,any>):any{
		let obj = Object.create(null);
		map.forEach((value, key)=>{
			obj[key]=value;
		});
		return obj;
	}

}