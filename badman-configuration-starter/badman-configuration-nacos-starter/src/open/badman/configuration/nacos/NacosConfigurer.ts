

import {Logger} from "log4js";
import { NacosConfigClient } from "nacos-config";
import {Initializing} from 'badman-core'
import LocalConfigurer from "../local/LocalConfigurer";
import NacosProperties from "./NacosProperties";
import ValidSubscribeMethodError from "./ValidSubscribeMethodError";

export default class NacosConfigurer implements Initializing{

    private logger:Logger;

    private nacos:NacosConfigClient;

    private defaultDataId:string = 'global_properties';

    private readonly dataIds:string[] = [this.defaultDataId];

    private readonly groupId:string;

    private properties:object;

    private readonly subscribed:boolean = true;
    private readonly customSubscribeCallback:Function;

    private readonly localServerAddr:string = 'localhost:8848';

    private readonly defaultNamespace:string = 'default';

    private readonly defaultUsername:string = 'nacos';

    private readonly defaultPassword:string = 'nacos';

    private skipFirstSubscribe:boolean = false;

    private subscribeDelaySeconds:number;


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

            if(options.subscribeScript){
                this.customSubscribeCallback = new Function(`{ ${options.subscribeScript} }`);
            }

            this.subscribeDelaySeconds = options.skipFirstSubscribeDelaySeconds?options.skipFirstSubscribeDelaySeconds:5000;
        }

        this.nacos = new NacosConfigClient(options);
    }

    get<T>(key:string):T|undefined {
        let ketElements:string[] = key.split('.');
        let everyLayer:any;
        for (let i = 0; i < ketElements.length; i++) {
            if(everyLayer){
                everyLayer = everyLayer[ketElements[i]];
            }else{
                everyLayer = this.properties[ketElements[i]];
            }
            if(!everyLayer){
                this.logger.warn(`${key} is non-existent`);
                return everyLayer;
            }
        }
        return <T>everyLayer;
    }

    async afterInitialized() {
        //this.properties = await this.nacos.batchGetConfig(this.dataIds,this.groupId);
        await this.set();
        if(this.subscribed) {
            if (this.customSubscribeCallback) {
                let c = this.customSubscribeCallback();
                if (c.refresh) {
                    this.subscribe(c.refresh);
                } else {
                    throw new ValidSubscribeMethodError('Properties subscribeScript invalid,it must contain methodName refresh() such as formatter code :\r\n' +
                        'const refresh = (c) => {\n' +
                        '  console.log(\'content\',c);\n' +
                        '  if(c){...doSomeThing(c);}\n' +
                        '}\n' +
                        'return refresh;');
                }
            } else {
                this.subscribe();
            }
        }
    }

    private async set(){
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
    }

    private refreshContent(content){
        for(let key in content){
            this.properties[key] = content[key];
        }
        this.logger.info(`刷新当前配置=》=》=》\n ${JSON.stringify(this.properties)}`);
    }

    public subscribe(callback?:Function){

        for (let i = 0; i < this.dataIds.length; i++) {
            let dataId = this.dataIds[i];
            this.nacos.subscribe({
                dataId: dataId,
                group: this.groupId
            }, content => {
                this.logger.debug(`Nacos Configuration Notified -> \n ${content}`);
                if(this.skipFirstSubscribe && content && callback){
                    this.refreshContent(JSON.parse(content));
                    callback(content);
                }
                if(!this.skipFirstSubscribe && i===this.dataIds.length-1){
                    setTimeout(()=>{
                        this.skipFirstSubscribe = true;
                        this.logger.info('Already set skipFirstSubscribe = true');
                    },this.subscribeDelaySeconds);
                }
            });

        }
    }

}

export {
    NacosProperties,
    NacosConfigClient
}