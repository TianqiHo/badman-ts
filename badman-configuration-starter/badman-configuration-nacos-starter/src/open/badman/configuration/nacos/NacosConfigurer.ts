

import {Logger} from "log4js";
import { NacosConfigClient } from "nacos-config";
import {Disposable} from 'badman-core'
import LocalConfigurer from "../local/LocalConfigurer";
import NacosProperties from "./NacosProperties";
import ValidSubscribeMethodError from "./ValidSubscribeMethodError";

export default class NacosConfigurer implements Disposable{

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

    private readonly subscribeDelaySeconds:number;


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

        if(this.subscribed) {
            this.logger.debug(' Starting run nacos.subscribe() method');
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

        this.nacos.on('error',err => {
            this.logger.error('NacosConfigurer error -> ',err);
        });

    }

    get<T>(key:string): T|undefined {

        if(!this.properties){
            this.logger.warn('Have you calling flash() method manually when the NacosConfigured being instantiated?');
            return null;
        }

        let keyElements:string[] = key.split('.');
        let everyLayer:any;
        for (let i = 0; i < keyElements.length; i++) {
            let key = keyElements[i];
            if(this.properties[key] || everyLayer[key]){
                if(everyLayer){
                    everyLayer = everyLayer[key];
                }else{
                    everyLayer = this.properties[key];
                }
            }else{
                this.logger.warn(` Key[${key}] is non-existent, Have you calling flash() method manually when the NacosConfigured being instantiated?`);
            }
        }
        return <T>everyLayer;
    }


    // afterInitialized (): Promise<void> {
    //     return this.flash();
    // }

    /**
     * The method afterInitialized () has been deleted,will be replaced with flash()
     * Suggest calling manually when the NacosConfigured being instantiated
     */
    public async flash(){
        //
        // let all = await this.nacos.batchGetConfig(this.dataIds,this.groupId);
        // let temporary: object;
        // for (let key in all) {
        //     temporary[key] = all[key];
        // }
        // this.properties = temporary;

        let temporary: object = Object.create(null);
        for (const dataId of this.dataIds) {
            let custom = JSON.parse(await this.nacos.getConfig(dataId, this.groupId));
            if (!temporary) {
                temporary = custom;
            } else {
                for (let key in custom) {
                    temporary[key] = custom[key];
                }
            }
        }
        this.properties = temporary;
        this.logger.info('Configuration -> ',this.properties);
    }

    private refreshContent(content){
        for(let key in content){
            this.properties[key] = content[key];
        }
        this.logger.info('refresh ->',this.properties);
    }

    public subscribe(callback?:Function){

        for (let i = 0; i < this.dataIds.length; i++) {
            let dataId = this.dataIds[i];
            this.nacos.subscribe({
                dataId: dataId,
                group: this.groupId
            }, content => {
                this.logger.debug('Nacos Configuration Notified ->', content);
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

    async destroy (): Promise<void> {
        this.nacos.close();
        this.logger.info('NacosConfigurer has been closed');
    }

}

export {
    NacosProperties,
    NacosConfigClient
}