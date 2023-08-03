

import HttpClientResponse from "./HttpClientResponse";


export default interface RestCommands{

	post<RequestDataType,ResponseDataType>(url:string,param:RequestDataType):Promise<HttpClientResponse>;


	get<RequestDataType,ResponseDataType>(url:string,param:RequestDataType):Promise<HttpClientResponse>;

	put<RequestDataType,ResponseDataType>(url:string,param:RequestDataType):Promise<HttpClientResponse>;

}