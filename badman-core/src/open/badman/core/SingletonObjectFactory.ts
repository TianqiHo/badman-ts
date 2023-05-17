


/**
 * 单例对象工厂类 (depleted)
 */
export default abstract class SingletonObjectFactory{


    protected static INSTANCE:any;

    protected constructor() {

    }

    protected abstract afterInitialized(instance:any);

    static Instance<ClassType>():ClassType{
        return SingletonObjectFactory.INSTANCE;
    }

    static init <ClassType>(ClassTypeObj: {new():ClassType}): ClassType {
        if(!SingletonObjectFactory.INSTANCE){
            SingletonObjectFactory.INSTANCE =  new ClassTypeObj();
            console.info(`Class[${SingletonObjectFactory.INSTANCE.constructor.name}] Initialized`);
            SingletonObjectFactory.INSTANCE.afterInitialized(SingletonObjectFactory.INSTANCE);

        }
        return SingletonObjectFactory.INSTANCE;
    }

    static initWithArgs <ClassType>(ClassTypeObj: {new(...args:unknown[]):ClassType},args:unknown[]): ClassType {
        if(!SingletonObjectFactory.INSTANCE){
            SingletonObjectFactory.INSTANCE = Reflect.construct<any,ClassType>(ClassTypeObj,args);
            console.info(`Class[${SingletonObjectFactory.INSTANCE.constructor.name}] Initialized`);
            SingletonObjectFactory.INSTANCE.afterInitialized(SingletonObjectFactory.INSTANCE);
        }
        return SingletonObjectFactory.INSTANCE;
    }

    static initWithArgs2 <ClassType>(ClassTypeObj: {new(...args:any[]):ClassType},...args:any[]): ClassType {
        if(!SingletonObjectFactory.INSTANCE){
            SingletonObjectFactory.INSTANCE =  new ClassTypeObj();
            console.info(`Class[${SingletonObjectFactory.INSTANCE.constructor.name}] Initialized`);
            if(args.length>0){
                for(let property of args){
                    for (let propertyKey in property) {
                        SingletonObjectFactory.INSTANCE[propertyKey] = property[propertyKey];
                        break;
                    }
                }
            }
            SingletonObjectFactory.INSTANCE.afterInitialized(SingletonObjectFactory.INSTANCE);
        }
        return SingletonObjectFactory.INSTANCE;
    }

    static initWithArg3 <ClassType>(ClassTypeObj: {new(...args:any[]): ClassType },arg:Partial<ClassType>): ClassType {
        if(!SingletonObjectFactory.INSTANCE){
            SingletonObjectFactory.INSTANCE =  new ClassTypeObj();
            console.info(`Class[${SingletonObjectFactory.INSTANCE.constructor.name}] Initialized`);
            if(arg){
                let propertyNames:string[] = Object.getOwnPropertyNames(SingletonObjectFactory.INSTANCE);

                for (const propertyName of propertyNames) {
                    SingletonObjectFactory.INSTANCE[propertyName] = arg[propertyName];
                }
            }
            SingletonObjectFactory.INSTANCE.afterInitialized(SingletonObjectFactory.INSTANCE);
        }
        return SingletonObjectFactory.INSTANCE;
    }
}