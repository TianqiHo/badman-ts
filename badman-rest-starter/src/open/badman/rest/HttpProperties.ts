

import {RequestTransformer, ResponseTransformer} from "./HttpTransformer";


export default interface HttpProperties{


	timeout?:number;

	headers?: Map<string,string | string[] | number | boolean>;

	maxBodyLength?:number;

	maxContentLength?:number;

	responseEncoding?:string;

	responseType?:string;

	withCredentials?:boolean;

	maxRedirects?:number;

	transformRequest?: RequestTransformer<unknown> | RequestTransformer<unknown>[];

	transformResponse?: ResponseTransformer<unknown> | ResponseTransformer<unknown>[];
}