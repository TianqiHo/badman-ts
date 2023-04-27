

import {ClientOptions} from "nacos-config";


export default interface NacosProperties extends ClientOptions{

	username:string;
	password:string;
	subscribed?:boolean

}