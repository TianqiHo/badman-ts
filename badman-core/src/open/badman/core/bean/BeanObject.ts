

export enum BeanType{
	Singleton,Prototype
}


export default interface BeanObject<T> {

	beanName?:string;

	type?: BeanType;

	constructor:{new(...args:any[]):T};

	args?:any[];

	// import bean instance ,not implement yet
	// injections?:string[];

	bean?:unknown;

	lazyInit?:boolean;

	initMethod?:string;

	destroyMethod?:string;


}