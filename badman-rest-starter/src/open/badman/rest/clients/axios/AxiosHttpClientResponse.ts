

import {AxiosResponse, HttpStatusCode} from "axios";
import HttpClientResponse from "../../HttpClientResponse";



export default class AxiosHttpClientResponse implements HttpClientResponse{

	private response:AxiosResponse;

	private OK:String = 'OK';

	constructor (response: AxiosResponse) {
		this.response = response;
	}

	body<ResponseBody> (): ResponseBody {
		let data:any = this.response.data;
		if(typeof data === 'string' || Buffer.isBuffer(data)){
			let obj:ResponseBody = JSON.parse(data.toString());
			return obj;
		}else{
			return <ResponseBody>data;
		}
		return null;
	}

	close () {}

	status (): number {
		return this.response.status;
	}

	success (): boolean {
		return HttpStatusCode.Ok === this.status();
	}

	message (): string {
		return this.response.statusText;
	}
}