
import {Initializing} from "badman-core";
import dotenv from 'dotenv';


export default class LocalConfigurer implements Initializing{


    constructor () {}


   async afterInitialized() {
        dotenv.config({override:true});
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