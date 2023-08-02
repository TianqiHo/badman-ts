
import {SyncInitializing} from "badman-core";
import dotenv from 'dotenv';
import LocalConfigurationProperties from "./LocalConfigurationProperties";


export default class LocalConfigurer implements SyncInitializing{


    private readonly properties:LocalConfigurationProperties;

    constructor (properties?:LocalConfigurationProperties) {
        this.properties = properties;
    }


   afterInitialized() {
        if(this.properties){
            dotenv.config(this.properties);
        }else{
            dotenv.config();
        }
    }

    public static getEnvironmentValue(key:string):string{
        return process.env[key];
    }

    public static getServerPort():number{
        return parseInt(LocalConfigurer.getEnvironmentValue('APPLICATION_PORT'));
    }

    public static getServerIp():string{
        return LocalConfigurer.getEnvironmentValue('APPLICATION_IP');
    }

    public static getServerName():string{
        return LocalConfigurer.getEnvironmentValue('APPLICATION_NAME');
    }

}