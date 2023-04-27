

import {Logging, SingletonObjectFactory2} from "badman-core";
import {Logger} from "log4js";
import LocalConfigurer from "./open/badman/configuration/local/LocalConfigurer";
import NacosConfigurer from "./open/badman/configuration/nacos/NacosConfigurer";
import NacosProperties from "./open/badman/configuration/nacos/NacosProperties";

class BadmanNacosConfigurer {

    async main(this:BadmanNacosConfigurer){

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
        logger.info(nacosConfigurer.get('TEST'));

    }
}
//
// (function (){
//     new BadmanNacosConfigurer().main();
// })();


export {LocalConfigurer,NacosProperties,NacosConfigurer};