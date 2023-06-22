
import * as console from "console";
import Initializing from "./Initializing";


/**
 * 单例对象工厂类(Depleted)
 */
export default abstract class SingletonObjectFactory2{


    protected static instances:Map<string,unknown> = new Map<string, unknown>();

    static All(){
        return SingletonObjectFactory2.instances;
    }

    static Instance<ClassType>(constructorName: string):ClassType{
        return <ClassType>SingletonObjectFactory2.instances.get(constructorName);
    }

    static async init <ClassType>(ClassTypeObj: {new():ClassType}): Promise<ClassType> {
        return SingletonObjectFactory2.initWithArgs(ClassTypeObj,[]);
    }

    static async inits <ClassType>(...ClassTypeObjs: {new():ClassType}[]): Promise<void> {
        for(let ClassTypeObj of ClassTypeObjs){
            await SingletonObjectFactory2.init(ClassTypeObj);
        }
        return ;
    }

    static async initWithArgs <ClassType>(ClassTypeObj: {new(...args:any[]):ClassType},args:any[]): Promise<ClassType> {
        return SingletonObjectFactory2.initWithKeyArgs(ClassTypeObj.name,ClassTypeObj,args);
    }

    static async initWithKeyArgs <ClassType>(key:string,ClassTypeObj: {new(...args:any[]):ClassType},args:any[]): Promise<ClassType> {

        if(!key){
            throw new Error('instance name is undefined ');
        }

        if(!SingletonObjectFactory2.instances.has(key)){
            let instance:ClassType = Reflect.construct(ClassTypeObj,args);
            console.info(` Class[${instance.constructor.name}] Initialized`);
            if((<Initializing>instance).afterInitialized){
                await (<Initializing>instance).afterInitialized();
                console.info(` Class[${instance.constructor.name}] Initializing has runned`);
            }
            // try {
            // } catch (e) {
            //     if(e instanceof TypeError){
            //         //ignore
            //         console.error('Ignore TypeError->',e);
            //     }else{
            //         throw e;
            //     }
            // }
            SingletonObjectFactory2.instances.set(key,instance);
        }
        return SingletonObjectFactory2.Instance(key);
    }
}