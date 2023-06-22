import * as console from "console";
import Beans from "../open/badman/core/bean/Beans";

class A {

	private ss:B;

	constructor () {
		this.ss = undefined;
	}

	setSs(s:B){
		this.ss = s;
	}

	a(){
		console.error('aaaaaaaaaaaaaaaaaaaaaaa');
	}

	init(){
		console.error('------------------------');
	}
}

class B {
	b(){
		console.error('bbbbbbbbbbbbbbbbbbbbbbb');
	}
}

export default class BeanExample {

	async main(){
		await Beans.LoadBean<A>({constructor:A,initMethod: 'init'});
		// await Beans.LoadBeans({constructor:A,initMethod: 'init'},{beanName:'H',constructor:B,lazyInit:true,type:BeanType.Prototype});
		//  (await Beans.Instance<A>(A.name)).a();
		// (await Beans.Instance<B>('H')).b();
	}
}

(()=>{
	new BeanExample().main()
})()