

import {Beans, Logging, SingletonObjectFactory2} from "badman-core";
import log4js, {Logger} from "log4js";


export default class LogUtil {

	public static deduceLogger():Logger{
		let logging:Logging = SingletonObjectFactory2.Instance<Logging>(Logging.name) || SingletonObjectFactory2.Instance<Logging>('logging');
		if(!logging){
			logging = Beans.Instance<Logging>(Logging.name) || Beans.Instance<Logging>('logging');
		}
		if(logging){
			return logging.logger("rest");
		}else{
			return log4js.getLogger("rest");
		}
	}
}