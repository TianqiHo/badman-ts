


import HttpClientRequest from "./HttpClientRequest";
import {HttpMethod} from "./HttpMethod";
import HttpProperties from "./HttpProperties";


export default interface HttpClientRequestFactory {

	createRequest<RequestDataType>(url:string, param:RequestDataType, method:HttpMethod, custom?:HttpProperties):Promise<HttpClientRequest>;

}