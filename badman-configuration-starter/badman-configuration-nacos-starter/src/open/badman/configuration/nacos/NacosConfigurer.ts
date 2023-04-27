

import {Logger} from "log4js";
import { NacosConfigClient } from "nacos-config";
import {Initializing} from 'badman-core'
import LocalConfigurer from "../local/LocalConfigurer";
import NacosProperties from "./NacosProperties";

export default class NacosConfigurer implements Initializing{

    private logger:Logger;

    private nacos:NacosConfigClient;

    private defaultDataId:string = 'global_properties';

    private readonly dataIds:string[] = [this.defaultDataId];

    private readonly groupId:string;

    private properties:object;

    private readonly subscribed:boolean = true;

    private readonly localServerAddr:string = 'localhost:8848';

    private readonly defaultNamespace:string = 'default';

    private readonly defaultUsername:string = 'nacos';

    private readonly defaultPassword:string = 'nacos';

    constructor(options:NacosProperties,logger:Logger) {
        this.logger = logger;
        let customDataId:string = LocalConfigurer.getEnvironmentValue('NACOS_DATA_IDS');
        if(customDataId){
            this.logger.info(`Customer NacosDataId is ${customDataId}`);
            let customDataIds:string[] = customDataId.split(',');
            this.dataIds = this.dataIds.concat(customDataIds);
        }

        this.groupId = LocalConfigurer.getEnvironmentValue('NACOS_DATA_GROUP');

        if(!options){
            options = {
                serverAddr: this.localServerAddr,
                namespace: this.defaultNamespace,
                username : this.defaultUsername,
                password : this.defaultPassword
            };
        }else{
            this.subscribed = options.subscribed;
        }

        this.nacos = new NacosConfigClient(options);
    }

    get(key):unknown {
        return this.properties?this.properties[key] : null;
    }

    async afterInitialized() {
        //this.properties = await this.nacos.batchGetConfig(this.dataIds,this.groupId);
        let temporary:object;
        for (const dataId of this.dataIds) {
              let custom = JSON.parse(await this.nacos.getConfig(dataId, this.groupId));
              if(!temporary){
                  temporary = custom;
              }else{
                  for(let key in custom){
                      temporary[key] = custom[key];
                  }
              }
        }
        this.properties = temporary;
        this.logger.info(`当前配置=》=》=》\n ${JSON.stringify(this.properties)}`)

        if(this.subscribed){
            this.subscribe();
        }
    }


    private subscribe(){
        for(let dataId of this.dataIds){
            this.nacos.subscribe({
                dataId: dataId,
                group: this.groupId
            }, content => {
                this.logger.debug(`Nacos Configuration Notified -> \n ${content}`);
            });
        }
    }

}

export {
    NacosProperties,
    NacosConfigClient
}