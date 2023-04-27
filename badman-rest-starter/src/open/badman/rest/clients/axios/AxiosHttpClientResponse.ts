

import {AxiosResponse, HttpStatusCode} from "axios";
import HttpClientResponse from "../../HttpClientResponse";



export default class AxiosHttpClientResponse implements HttpClientResponse{

	private response:AxiosResponse;

	constructor (response: AxiosResponse) {
		this.response = response;
	}

	body<ResponseBody> (): ResponseBody {
		return <ResponseBody>this.response.data;
	}

	close () {

	}

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