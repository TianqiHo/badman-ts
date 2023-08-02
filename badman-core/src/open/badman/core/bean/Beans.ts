

import { Logger} from "log4js";
import * as process from "process";
import Disposable from "../Disposable";
import Initializing from "../Initializing";
import Logging from "../logging/Logging";
import BeanObject, {BeanType} from "./BeanObject";


export default class Beans {

	private static readonly beanObjectMap:Map<string,BeanObject<any>> = new Map<string, BeanObject<any>>();

	private static logger:Logger;

	static {
		let logging:Logging = new Logging();
		logging.afterInitialized();
		Beans.logger = logging.logger();
	}

	static LoadBeans(...beans:BeanObject<any>[]){
		for (let bean of beans) {
			 Beans.LoadBean(bean);
		}
	}

	private static instance<T>(beanObject:BeanObject<T>){
		//IOC
		beanObject.bean = Reflect.construct<any[],T>(beanObject.constructor,beanObject.args);
		Beans.logger.info(`${beanObject.beanName} Instantiation completed`);

		if(beanObject.initMethod){
			beanObject.bean[beanObject.initMethod].apply(beanObject.bean);
			Beans.logger.info(`${beanObject.beanName}.${beanObject.initMethod}(initMethod) run completed`);
		}else if((<Initializing>beanObject.bean).afterInitialized){
			(<Initializing>beanObject.bean).afterInitialized();
			Beans.logger.info(`${beanObject.beanName}.afterInitialized(Initializing) run completed,but maybe asynchronous`);
		}
		//DI
		if(beanObject.bean[beanObject.constructor.name]){
			Beans.di<T>(beanObject);
		}
	}

	private static di<T>(beanObject:BeanObject<T>){
		let dependOns:string[] = beanObject.bean[beanObject.constructor.name].apply(beanObject.bean);
		if(dependOns && dependOns.length>=1){
			for (let i = 0; i < dependOns.length; i++) {
				let beanName:string = dependOns[i];
				let bean = Beans.Instance(beanName);
				if(bean){
					//todo maybe not precise?
					if(bean[beanObject.constructor.name]){
						this.logger.warn(`Bean[${beanName}] is circular,from Class ${beanObject.constructor.name}`);
					}
					beanObject.bean[beanName]=bean;
				}else{
					process.nextTick((dependBean)=>{
						if(!dependBean){
							dependBean = Beans.Instance(beanName);
						}
						if(dependBean){
							beanObject.bean[beanName]=dependBean;
						}else {
							this.logger.warn(`Bean[${beanName}] is invalidate,from Class ${beanObject.constructor.name}`);
						}
					},Beans.Instance(beanName));

				}
			}
		}
	}

	static LoadBean<T>(beanObject:BeanObject<T>):T{
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
			if(BeanType.Singleton === beanObject.type && !beanObject.lazyInit){
				Beans.instance<T>(beanObject);
			}
		}

		Beans.beanObjectMap.set(beanObject.beanName,beanObject);
		return <T>beanObject.bean;
	}

	static Instance<T>(beanName:string):T{

		if(Beans.beanObjectMap.has(beanName)){
			let beanObject:BeanObject<T> = Beans.beanObjectMap.get(beanName);
			if(beanObject){
				if(beanObject.bean){
					return <T>beanObject.bean;
				}else{

					if(beanObject.type === BeanType.Prototype){
						Beans.instance(beanObject);
						let bean:T =  <T>beanObject.bean;
						beanObject.bean = null;
						return bean;
					}

					if(beanObject.lazyInit && beanObject.type === BeanType.Singleton){
						Beans.instance(beanObject);
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
			Beans.logger.info(`${beanObject.beanName}.${beanObject.destroyMethod}(destroyMethod) run completed`);
		}else if((<Disposable>beanObject.bean).destroy){
			(<Disposable>beanObject.bean).destroy();
			Beans.logger.info(`${beanObject.beanName}.destroy(Disposable) run completed`);
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

	public static getBeans(){
		return Beans.beanObjectMap;
	}

}