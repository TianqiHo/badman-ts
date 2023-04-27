


import HttpClientRequest from "./HttpClientRequest";
import {HttpMethod} from "./HttpMethod";


export default interface HttpClientRequestFactory {

	createRequest<RequestDataType>(url:string, param:RequestDataType, method:HttpMethod):Promise<HttpClientRequest>;

}