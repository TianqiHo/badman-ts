

import { Logger} from "log4js";
import Initializing from "../Initializing";
import Logging from "../logging/Logging";
import SyncInitializing from "../SyncInitializing";
import BeanObject, {BeanType} from "./BeanObject";


export default class Beans{
	private static beanObjectMap:Map<string,BeanObject<any>> = new Map<string, BeanObject<any>>();

	private static logger:Logger;

	static {
		let logging:Logging = new Logging();
		logging.afterInitialized();
		Beans.logger = logging.logger();
	}

	static async LoadBeans(...beans:BeanObject<any>[]){
		for (let bean of beans) {
			 await Beans.LoadBean(bean);
		}
	}

	private static async instance<T>(beanObject:BeanObject<T>){
		beanObject.bean = Reflect.construct<any[],T>(beanObject.constructor,beanObject.args);
		Beans.logger.info(`${beanObject.beanName} Instantiation completed`);

		if(beanObject.initMethod){
			await beanObject.bean[beanObject.initMethod].apply(beanObject.bean);
			Beans.logger.info(`${beanObject.beanName}.${beanObject.initMethod}(initMethod) run completed`);
		}else{
			if((<Initializing>beanObject.bean).afterInitialized){
				await (<Initializing>beanObject.bean).afterInitialized();
				Beans.logger.info(`${beanObject.beanName}.afterInitialized(Initializing) run completed`);
				return ;
			}else{
				if((<SyncInitializing>beanObject.bean).afterInitialized){
					(<SyncInitializing>beanObject.bean).afterInitialized();
					Beans.logger.info(`${beanObject.beanName}.afterInitialized(SyncInitializing)  run completed`);
				}
			}
		}
	}

	static async LoadBean<T>(beanObject:BeanObject<T>):Promise<T>{
		if(!beanObject){
			throw new Error('beanObject can not be null');
		}

		if(!beanObject.bean){
			if(!beanObject.constructor){
				throw new Error('beanObject‘constructor attribute value can not be null');
			}

			if(!beanObject.beanName){
				beanObject.beanName = beanObject.constructor.name;
			}

			beanObject.lazyInit = !!beanObject.lazyInit;

			if(!beanObject.type){
				beanObject.type = BeanType.Singleton;
			}

			if(!beanObject.args){
				beanObject.args = [];
			}
			if(BeanType.Singleton===beanObject.type && !beanObject.lazyInit){
				await Beans.instance<T>(beanObject);
			}
		}

		Beans.beanObjectMap.set(beanObject.beanName,beanObject);
		return <T>beanObject.bean;
	}

	static async Instance<T>(beanName:string):Promise<T>{

		if(Beans.beanObjectMap.has(beanName)){
			let beanObject:BeanObject<T> = Beans.beanObjectMap.get(beanName);
			if(beanObject){
				if(beanObject.bean){
					return <T>beanObject.bean;
				}else{

					if(beanObject.type === BeanType.Prototype){
						await Beans.instance(beanObject);
						return <T>beanObject.bean;
					}

					if(beanObject.lazyInit && beanObject.type === BeanType.Singleton){
						await Beans.instance(beanObject);
						return <T>beanObject.bean;
					}
				}
			}
		}
		return null;
	}


	static UnloadBeans(){
		Beans.beanObjectMap.forEach((beanObject:BeanObject<any>)=>{
			Beans.Unload(beanObject,beanObject.beanName);
		});
	}

	static UnloadBean(beanName:string){
		if(Beans.beanObjectMap.has(beanName)){
			let beanObject:BeanObject<any> = Beans.beanObjectMap.get(beanName);
			Beans.Unload(beanObject,beanName);
		}
	}

	private static Unload(beanObject:BeanObject<any>,beanName:string){

		if(beanObject.destroyMethod){
			beanObject.bean[beanObject.destroyMethod].apply(beanObject.bean);
			Beans.logger.info(`${beanObject.beanName}.${beanObject.destroyMethod} run completed`);
		}
		beanObject.beanName = undefined;
		beanObject.type = undefined;
		beanObject.args = undefined;
		beanObject.lazyInit = undefined;
		beanObject.constructor = undefined;
		beanObject.initMethod = undefined;
		beanObject.destroyMethod = undefined;
		beanObject.bean = undefined;
		Beans.beanObjectMap.delete(beanName);
	}

}