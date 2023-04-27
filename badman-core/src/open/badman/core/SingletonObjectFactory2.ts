
import Initializing from "./Initializing";


/**
 * 单例对象工厂类
 */
export default abstract class SingletonObjectFactory2{


    private static instances:Map<string,unknown> = new Map<string, unknown>();


    static Instance<ClassType>(constructorName: string):ClassType{
        return <ClassType>SingletonObjectFactory2.instances.get(constructorName);
    }


    static async init <ClassType extends Initializing>(ClassTypeObj: {new():ClassType}): Promise<ClassType> {
        return SingletonObjectFactory2.initWithArgs(ClassTypeObj,[]);
    }

    static async initWithArgs <ClassType extends Initializing>(ClassTypeObj: {new(...args:any[]):ClassType},args:any[]): Promise<ClassType> {

        if(!SingletonObjectFactory2.instances.has(ClassTypeObj.name)){
            let instance:ClassType = Reflect.construct(ClassTypeObj,args);
            console.info(` Class[${instance.constructor.name}] Initialized`);
            await (<Initializing>instance).afterInitialized();
            console.info(` Class[${instance.constructor.name}] Initializing has runned`);
            SingletonObjectFactory2.instances.set(ClassTypeObj.name,instance);
        }
        return SingletonObjectFactory2.Instance(ClassTypeObj.name);
    }
}