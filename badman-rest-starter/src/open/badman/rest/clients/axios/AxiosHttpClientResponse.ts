

import {AxiosResponse, HttpStatusCode} from "axios";
import HttpClientResponse from "../../HttpClientResponse";



export default class AxiosHttpClientResponse implements HttpClientResponse{

	private response:AxiosResponse;

	constructor (response: AxiosResponse) {
		this.response = response;
	}

	body<ResponseBody> (): ResponseBody {
		let data = this.response.data;
		return <ResponseBody>data;
	}

	toJson():any{
		let data = this.body();
		try {
			if(data){
				return JSON.parse(data.toString());
			}
			return null;
		} catch (e) {
			return null;
		}
	}

	close () {}

	status (): number {
		return this.response.status;
	}

	success (): boolean {
		return HttpStatusCode.Ok === this.status();
	}

	is2xxSuccessful():boolean{
		return this.status() >= HttpStatusCode.Ok && this.status() < HttpStatusCode.MultipleChoices;
	}

	message (): string {
		return this.response.statusText || this.response.data;
	}
}