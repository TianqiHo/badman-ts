import * as console from "console";
import Base from "../open/badman/core/Base";
import {BeanType} from "../open/badman/core/bean/BeanObject";
import Beans from "../open/badman/core/bean/Beans";
import Initializing from "../open/badman/core/Initializing";
import SyncInitializing from "../open/badman/core/SyncInitializing";

class A implements SyncInitializing{

	b:B;
	c:C;

	constructor () {}

	A(){
		return ['b','c'];
	}

	 async a(){
		await console.error('aaaaaaaaaaaaaaaaaaaaaaa');
	}

	async afterInitialized () {

		//Base.sleep(2000,()=>{console.info('---------------sleep----------------')});
		console.info('---------------1----------------')
		// new Promise<boolean>(async (resolve, reject)=>{
		// 	console.info('---------------2----------------')
		// });
		// console.info('---------------3----------------')

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

	async main(){

		while (true){
			await Base.sleep(500,()=>{console.info('waiting')});
		}


		//let b:B = Beans.LoadBean<B>({constructor:B,beanName:'b',lazyInit:true,type:BeanType.Prototype});
		//let a:A = Beans.LoadBean<A>({constructor:A});
		//let c:C = Beans.LoadBean<C>({constructor:C,beanName:'c',lazyInit:true});

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