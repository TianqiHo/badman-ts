

import {Instance} from "nacos-naming";

export default interface NacosInstanceProperties {

	serviceName: string;
	instance?: Instance;
	groupName?: string;
	clusters?:string;
	subscribe?: boolean;

}