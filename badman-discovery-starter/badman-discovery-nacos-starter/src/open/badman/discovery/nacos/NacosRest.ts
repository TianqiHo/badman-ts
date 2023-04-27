

import {Initializing, Logging, SingletonObjectFactory2} from "badman-core";
import {HttpClientResponse, RestTemplate} from "badman-rest-starter";
import {Logger} from "log4js";
import NacosDiscovery from "./NacosDiscovery";
import NacosInstanceProperties from "./NacosInstanceProperties";
import RestRequestParam from "./RestRequestParam";


export default class NacosRest implements Initializing{

	private logger:Logger;
	private readonly restTemplate:RestTemplate;
	private readonly nacosDiscovery:NacosDiscovery;

	constructor () {
		this.logger = SingletonObjectFactory2.Instance<Logging>(Logging.name).logger(NacosRest.name);

		this.restTemplate = SingletonObjectFactory2.Instance<RestTemplate>(RestTemplate.name);
		if(!this.restTemplate){
			throw new Error('RestTemplate can not be null');
		}
		this.nacosDiscovery = SingletonObjectFactory2.Instance<NacosDiscovery>(NacosDiscovery.name);
		if(!this.nacosDiscovery){
			throw new Error('NacosDiscovery can not be null');
		}
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
			if(request.serviceNameForPath && !address.includes(request.serviceName)){
				uri += request.serviceName;
			}
			if(request.namespace){
				uri += request.namespace;
			}
			if(request.uri){
				uri += request.uri;
			}
			let url = `${address}${uri}`;
			this.logger.info(`服务地址->${url}`);
			let response:HttpClientResponse;
			switch (request.method) {
				case 'POST' || 'post': {
					response = await this.restTemplate.post<RequestBodyType,ResponseBodyType>(url, request.param);
					break;
				}
				case 'GET' || 'get': {
					response = await this.restTemplate.get<RequestBodyType,ResponseBodyType>(url, request.param);
					break;
				}
			}
			return response;
		}else {
			throw new Error(`Nacos服务列表无效[${request.serviceName}]`);
		}
	}

}