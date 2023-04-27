

NacosDiscovery MicroSoftware

Demo API:

        await SingletonObjectFactory2.init<Logging>(Logging);

		let serverProperties:NacosServerProperties = {
			logger: console, namespace: "dev", serverList: ["localhost:8848"],thisServerPort:1000,thisServerName:'Test'
		}

		let nacosDiscovery:NacosDiscovery = await SingletonObjectFactory2.initWithArgs<NacosDiscovery>(NacosDiscovery,[false,serverProperties]);

		let restTemplate:RestTemplate = await SingletonObjectFactory2.initWithArgs<RestTemplate>(RestTemplate,[new AxiosHttpClientRequestFactory({
			responseType: 'json'
		})]);

		let nacosRest:NacosRest = await SingletonObjectFactory2.init<NacosRest>(NacosRest);

		let request:RestRequestParam<Object> = {
			serviceName:'application',
			uri:'/testB',
			method: HttpMethod.GET,
			param: {aaa:'aaaaaaa'},
			serviceNameForPath:true
		};

		let response:HttpClientResponse = await nacosRest.execute<Object,string>(request);
		console.info(response.body<string>());

		// console.info(await nacosDiscovery.obtainInstance(nacosInstanceProperties));