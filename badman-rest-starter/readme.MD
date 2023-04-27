

HttpClient MicroSoftware

Demo API:

    export default class BadmanRest {
        async main(){
            let logger:Logger = (await SingletonObjectFactory2.initWithArgs<Logging>(Logging,['log4js_properties.json'])).logger(BadmanRest.name);
    
            let rest:RestTemplate =  await SingletonObjectFactory2.initWithArgs<RestTemplate>(RestTemplate,[new AxiosHttpClientRequestFactory()]);
    
            // let response:HttpClientResponse = await rest.post<Object,Object>('http://192.168.1.27:6999/testA',JSON.stringify({ss:'sssss'}));
    
            let response:HttpClientResponse = await rest.get<Object,Object>('http://192.168.1.27:6999/testB',{aaa:'sssss'});
            logger.debug(response.body());
        }
    }