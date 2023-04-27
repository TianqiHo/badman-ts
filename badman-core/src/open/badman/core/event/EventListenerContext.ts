


export default interface EventListenerContext{

    primaryKey:string;

    readonly events ?:any[];

    error?:{};
}