
import MongoConnection from "../../MongoConnection";

import {
    Collection,
    Db,
    InsertOneResult,
    UpdateResult
} from "mongodb";


export default class ClientSimpleMongoConnection implements MongoConnection {

    private db: Db;

    private collection: Collection;

    constructor(db: Db,collection: Collection) {
        this.db = db;
        this.collection = collection;
    }


    async insert<T>(dbName: string, collectionName: string, data: T): Promise<string> {
        let result: InsertOneResult<T> = await this.collection.insertOne(data);
        return result.insertedId.toString();
    }

    async update<T>(dbName:string,collectionName:string,primaryKey:{},data:T):Promise<UpdateResult> {
        let u:UpdateResult = await this.collection.updateOne(primaryKey,data,{upsert:true});
        return u;
    }

    find<T>(dbName: string, collectionName: string, primaryKey: {}): Promise<T> {
       return this.collection.findOne<T>(primaryKey);
    }

    list() {
    }

    close () {

    }

    isClosed (): boolean {

        return true;
    }

    open (): boolean {
        return true;
    }

}