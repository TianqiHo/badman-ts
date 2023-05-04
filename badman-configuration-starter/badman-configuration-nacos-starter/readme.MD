

Configuration :

.env file By LocalConfigurer Class

OR

Cloud-Nacos  By NacosConfigurer Class.





Demo API:

.env file:

    NACOS_DATA_IDS: 'custom_properties,custom2_properties'
    NACOS_ADDRESS: 'localhost:8848'
    NACOS_NAMESPACE: 'dev'
    NACOS_DATA_GROUP: 'DEFAULT_GROUP'
    NACOS_USERNAME: nacos
    NACOS_PASSWORD: nacos



Code:

    main(){

        await SingletonObjectFactory2.init(LocalConfigurer);

        let logging:Logging =  await SingletonObjectFactory2.initWithArgs(Logging,['nacos_configuration_log4js_properties.json']);
        let logger:Logger = logging.logger(BadmanNacosConfigurer.name);

        let nacosProperties:NacosProperties = {
            serverAddr: LocalConfigurer.getEnvironmentValue('NACOS_ADDRESS'),
            namespace: LocalConfigurer.getEnvironmentValue('NACOS_NAMESPACE'),
            username : LocalConfigurer.getEnvironmentValue('NACOS_USERNAME'),
            password : LocalConfigurer.getEnvironmentValue('NACOS_PASSWORD'),
        };
        let nacosConfigurer:NacosConfigurer = await SingletonObjectFactory2.initWithArgs(NacosConfigurer,[nacosProperties,logger]);

        let a:A = nacosConfigurer.get<A>('baidu.map')
    }