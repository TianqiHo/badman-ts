

import {UpdateResult} from "mongodb";


export default interface MongoCommand{


    insert<T>(dbName:string,collectionName:string,data:T):Promise<string>;

    update<T>(dbName:string,collectionName:string,primaryKey:{},data:T):Promise<UpdateResult>;

    find<T>(dbName:string,collectionName:string,primaryKey:{}):Promise<T>;

    list();

}