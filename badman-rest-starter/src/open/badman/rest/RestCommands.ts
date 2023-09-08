

import HttpClientResponse from "./HttpClientResponse";
import {HttpMethod} from "./HttpMethod";
import HttpProperties from "./HttpProperties";


export default interface RestCommands{

	execute<RequestDataType,ResponseDataType>(url:string, method:HttpMethod,
	                                          param:RequestDataType,
	                                          custom?:HttpProperties):Promise<HttpClientResponse>;

	post<RequestDataType,ResponseDataType>(url:string,param:RequestDataType, custom?:Map<string,string | string[] | number | boolean>|HttpProperties):Promise<HttpClientResponse>;

	post<RequestDataType,ResponseDataType>(url:string,param:RequestDataType, custom?:Map<string,string | string[] | number | boolean>|HttpProperties):Promise<HttpClientResponse>;

	get<RequestDataType,ResponseDataType>(url:string,param:RequestDataType, custom?:Map<string,string | string[] | number | boolean>|HttpProperties):Promise<HttpClientResponse>;

	put<RequestDataType,ResponseDataType>(url:string,param:RequestDataType, custom?:Map<string,string | string[] | number | boolean>|HttpProperties):Promise<HttpClientResponse>;

	delete<RequestDataType,ResponseDataType>(url:string,param:RequestDataType, custom?:Map<string,string | string[] | number | boolean>|HttpProperties):Promise<HttpClientResponse>;

}