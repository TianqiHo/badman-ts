

import {Beans, Initializing, Logging, SingletonObjectFactory2} from "badman-core";
import {HttpClientResponse, RestTemplate} from "badman-rest-starter";
import log4js,{Logger} from "log4js";
import NacosDiscovery from "./NacosDiscovery";
import NacosInstanceProperties from "./NacosInstanceProperties";
import NoSuchServer from "./NoSuchServer";
import RestRequestError from "./RestRequestError";
import RestRequestParam from "./RestRequestParam";





export default class NacosRest implements Initializing{

	private logger:Logger;
	private restTemplate:RestTemplate;
	private nacosDiscovery:NacosDiscovery;

	constructor (restTemplate?:RestTemplate,nacosDiscovery?:NacosDiscovery,logger?:Logger) {

		if(logger){
			this.logger = logger;
		}else{
			this.logger = this.deduceLogger(NacosRest.name);
		}

		if(restTemplate){
			this.restTemplate = restTemplate;
		}else{
			this.deduceRestTemplate();
		}

		if(!this.restTemplate){
			throw new Error('RestTemplate can not be null');
		}

		if(nacosDiscovery){
			this.nacosDiscovery = nacosDiscovery;
		}else{
			this.deduceNacosDiscovery();
		}

		if(!this.nacosDiscovery){
			throw new Error('NacosDiscovery can not be null');
		}
	}

	private deduceLogger(category?:string){
		let logging:Logging = SingletonObjectFactory2.Instance<Logging>(Logging.name) || SingletonObjectFactory2.Instance<Logging>('logging');
		if(!logging){
			logging = Beans.Instance<Logging>(Logging.name) || Beans.Instance<Logging>('logging');
		}
		if(logging){
			return logging.logger(category || 'default');
		}else{
			return log4js.getLogger(category || 'default');
		}
	}

	private deduceRestTemplate(){

		let restTemplate:RestTemplate = SingletonObjectFactory2.Instance<RestTemplate>(RestTemplate.name) || SingletonObjectFactory2.Instance<RestTemplate>('restTemplate');
		if(!restTemplate){
			restTemplate = Beans.Instance<RestTemplate>(RestTemplate.name) || Beans.Instance<RestTemplate>('restTemplate');
		}
		this.restTemplate = restTemplate;
	}

	private deduceNacosDiscovery(){
		let nacosDiscovery:NacosDiscovery = SingletonObjectFactory2.Instance<NacosDiscovery>(NacosDiscovery.name) || SingletonObjectFactory2.Instance<NacosDiscovery>('nacosDiscovery');
		if(!nacosDiscovery){
			nacosDiscovery = Beans.Instance<NacosDiscovery>(NacosDiscovery.name) || Beans.Instance<NacosDiscovery>('nacosDiscovery');
		}
		this.nacosDiscovery = nacosDiscovery;
	}

	async afterInitialized () {

	}


	async execute<RequestBodyType,ResponseBodyType>(request:RestRequestParam<RequestBodyType>):Promise<HttpClientResponse>{
		let instanceProperties:NacosInstanceProperties = {
			serviceName: request.serviceName,
			groupName: request.groupName,
			subscribe: true
		}
		let address:string = await this.nacosDiscovery.obtainInstance(instanceProperties);
		if(address){
			let uri:string = '/';
			if(request.serviceNameForPath){
				uri += request.serviceName;
			}
			if(request.namespace){
				uri += request.namespace;
			}
			if(request.uri){
				uri += request.uri;
			}
			let url = `${address}${uri}`;
			this.logger.debug(`The whole url ->${url}`);
			let response:HttpClientResponse;
			switch (request.method) {
				case 'POST' || 'post': {
					response = await this.restTemplate.post<RequestBodyType,ResponseBodyType>(url, request.param,request.header);
					break;
				}
				case 'GET' || 'get': {
					response = await this.restTemplate.get<RequestBodyType,ResponseBodyType>(url, request.param,request.header);
					break;
				}
				case 'PUT' || 'put':{
					response = await this.restTemplate.put<RequestBodyType,ResponseBodyType>(url, request.param,request.header);
					break;
				}
				default:
					throw new RestRequestError(`Not Supported MethodType [ ${request.method} ]`);
			}
			return response;
		}else {
			throw new NoSuchServer(`Invalid or Can't find the service of [${request.serviceName}] from Nacos Server`);
		}
	}

}