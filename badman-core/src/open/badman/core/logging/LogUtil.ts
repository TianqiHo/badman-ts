

import log4js, {Logger} from "log4js";
import {SingletonObjectFactory2} from "../../../../BadmanCore";
import Beans from "../bean/Beans";
import Logging from "./Logging";





export default class LogUtil {

	public static deduceLogger(category?:string):Logger{
		let logging:Logging = SingletonObjectFactory2.Instance<Logging>(Logging.name) || SingletonObjectFactory2.Instance<Logging>('logging');
		if(!logging){
			logging = Beans.Instance<Logging>(Logging.name) || Beans.Instance<Logging>('logging');
		}
		if(logging){
			return logging.logger(category || 'default');
		}else{
			return log4js.getLogger(category || 'default');
		}
	}
}