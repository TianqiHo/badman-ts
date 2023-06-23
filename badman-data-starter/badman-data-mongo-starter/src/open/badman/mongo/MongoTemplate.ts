

import {Disposable, Initializing} from "badman-core";
import {Logger} from "log4js";
import {
    AggregateOptions, AggregationCursor,
    Filter,
    FindCursor,
    FindOptions,
    InsertOneOptions,
    InsertOneResult,
    OptionalUnlessRequiredId, UpdateFilter, UpdateOptions,
    UpdateResult
} from "mongodb";
import MongoAccessor from "./MongoAccessor";
import MongoCommand from "./MongoCommand";
import MongoConnection from "./MongoConnection";
import ClientMongoFactory from "./ClientMongoFactory";


export default class MongoTemplate extends MongoAccessor implements MongoCommand,Initializing,Disposable{

    private logger:Logger;

    constructor(clientMongoFactory:ClientMongoFactory<MongoConnection>,logger:Logger) {
        super(clientMongoFactory);
        this.logger=logger;
    }

    async afterInitialized () {

    }

   async destroy () {

   }

   async find<T> (dbName: string, collectionName: string, filter?: Filter<T>, options?: FindOptions): Promise<T[]> {
       let connection:MongoConnection = await this.createConnection(dbName,collectionName);
       let findCursor:FindCursor<T> = connection.find<T>(filter,options);
       return await findCursor.toArray();
   }

    async findOne<T>(dbName:string,collectionName:string,filter?: Filter<T>, options?: FindOptions): Promise<T>{
        let connection:MongoConnection = await this.createConnection(dbName,collectionName);
        return await connection.findOne<T>(filter,options);
    }

    async insert<T>(dbName:string,collectionName:string,doc: OptionalUnlessRequiredId<T>, options?: InsertOneOptions):Promise<string>{
        let connection:MongoConnection = await this.createConnection(dbName,collectionName);
        let insertOneResult:InsertOneResult<T> = await connection.insert(doc,options);
        if(insertOneResult.acknowledged){
            this.logger.info(' dbName = %s, collectionName=%s,  acknowledged = %s',dbName,collectionName,insertOneResult.acknowledged);
            this.logger.info(' insertData = %s ',JSON.stringify(doc));
        }
        return insertOneResult.insertedId.toHexString();
    }

    async update<T>(dbName:string,collectionName:string,filter: Filter<T>, update: UpdateFilter<T> | Partial<T>, options?: UpdateOptions):Promise<UpdateResult<T>>{
        let connection:MongoConnection = await this.createConnection(dbName,collectionName);
        let updateResult:UpdateResult<T> = await connection.update<T>(filter, update, options);
        return updateResult;
    }

    async aggregate<T>(dbName:string,collectionName:string,pipeline?: T[], options?: AggregateOptions): Promise<T[]>{
        let connection:MongoConnection = await this.createConnection(dbName,collectionName);
        let aggregationCursor:AggregationCursor<T> = await connection.aggregate<T>(pipeline,options);
        return aggregationCursor.toArray();
    }
}