
import SingletonObjectFactory2 from "./SingletonObjectFactory2";


export default class Beans extends SingletonObjectFactory2{


	static async loadBeans(...beans:{beanName:string,ClassTypeObj: {new():unknown}}[]){
		for (let bean of beans) {
			await Beans.loadBean(bean.beanName,bean.ClassTypeObj);
		}
	}

	static async loadBeansWithArgs(...beans:{beanName:string,ClassTypeObj: {new(...args:any[]):unknown},args:any[]}[]){
		for (let bean of beans) {
			await Beans.loadBeanWithArgs(bean.beanName,bean.ClassTypeObj,bean.args);
		}
	}

	static async loadBean(beanName:string,ClassTypeObj: {new():unknown}){
		await Beans.initWithKeyArgs(beanName,ClassTypeObj,[]);
	}

	static async loadBeanWithArgs(beanName:string,ClassTypeObj: {new(...args:any[]):unknown},args:any[]){
		await Beans.initWithKeyArgs(beanName,ClassTypeObj,args);
	}

}