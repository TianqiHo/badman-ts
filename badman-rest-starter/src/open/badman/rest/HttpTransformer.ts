
import HttpHeaders from "./HttpHeaders";


export interface RequestTransformer<T> {
	(data: T, headers: HttpHeaders): T;
}

export interface ResponseTransformer<T> {
	(data: T, headers: HttpHeaders,status?: number): T;
}