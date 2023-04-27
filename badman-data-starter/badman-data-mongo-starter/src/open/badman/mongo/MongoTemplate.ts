

import {Disposable, Initializing} from "badman-core";
import {UpdateResult} from "mongodb";
import MongoAccessor from "./MongoAccessor";
import MongoCommand from "./MongoCommand";
import MongoConnection from "./MongoConnection";
import ClientMongoFactory from "./ClientMongoFactory";


export default class MongoTemplate extends MongoAccessor implements MongoCommand,Initializing,Disposable{

    constructor(clientMongoFactory:ClientMongoFactory<MongoConnection>) {
        super(clientMongoFactory);
    }

    async afterInitialized () {

    }

   async destroy () {

   }

    async insert<T>(dbName:string,tableName:string,data:T):Promise<string> {
        let connection:MongoConnection = await this.createConnection(dbName,tableName);
        return await connection.insert(dbName,tableName,data);
    }

    async update<T>(dbName:string,tableName:string,primaryKey:{},data:T):Promise<UpdateResult> {
        let connection:MongoConnection = await this.createConnection(dbName,tableName);
        return await connection.update(dbName,tableName,primaryKey,data);
    }

    async find<T>(dbName:string,tableName:string,primaryKey:{}) {
        let connection:MongoConnection = await this.createConnection(dbName,tableName);
        return await connection.find<T>(dbName,tableName,primaryKey);
    }

    async list() {
        // let connection:MongoConnection = await this.createConnection();
        // connection.list();
    }

}