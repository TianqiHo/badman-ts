

import HttpClientResponse from "./HttpClientResponse";


export default interface HttpClientRequest{

	 execute<RequestDataType,ResponseDataType>():Promise<HttpClientResponse>;

}