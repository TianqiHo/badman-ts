import * as console from "console";
import {BeanType} from "../open/badman/core/bean/BeanObject";
import Beans from "../open/badman/core/bean/Beans";

class A {

	b:B;
	c:C;

	constructor () {}

	A(){
		return ['b','c'];
	}

	 async a(){
		await console.error('aaaaaaaaaaaaaaaaaaaaaaa');
	}

	init(){
		console.error('----------------1---------------');
		(()=>{
			console.error('-------------2------------------');
			this.a();
			console.error('--------------3-----------------');
		})();
		console.error('-----------------4--------------');
	}
}

class B {

	// B(){
	// 	return ['c'];
	// }
	b(){
		console.error('bbbbbbbbbbbbbbbbbbbbbbb');
	}
}

class C {

	b:B;

	C(){
		return ['b']
	}
	c(){
		console.error('cccccccccccccccccccccccccccc');
	}
}

export default class BeanExample {

	main(){

		let b:B = Beans.LoadBean<B>({constructor:B,beanName:'b',lazyInit:true,type:BeanType.Prototype});
		let a:A = Beans.LoadBean<A>({constructor:A,initMethod: 'init'});
		let c:C = Beans.LoadBean<C>({constructor:C,beanName:'c',lazyInit:true});

		// setInterval(()=>{
		// 	console.info(a.b === a.c.b);
		// },3000);

		// await Beans.LoadBeans({constructor:A,initMethod: 'init'},{beanName:'H',constructor:B,lazyInit:true,type:BeanType.Prototype});
		//  (await Beans.Instance<A>(A.name)).a();
		// (await Beans.Instance<B>('H')).b();


	}
}

(()=> {
	new BeanExample().main()
})();