

import MongoConnection from "../../MongoConnection";
import {Connection, HydratedDocument, Model, Mongoose, Schema} from "mongoose";
import {
    Filter,
    InsertOneOptions,
    InsertOneResult,
    OptionalUnlessRequiredId,
    UpdateFilter, UpdateOptions,
    UpdateResult
} from "mongodb";


export default class ClientMongooseConnection{

    private mongoose:Mongoose;

    private connection:Connection;

    private readonly models:Map<string,Model<any>>;

    constructor( connection:Connection,mongoose?:Mongoose) {
        this.mongoose = mongoose;
        this.connection = connection;
        this.models = new Map<string, Model<any>>();

        // let emergencyCaseSchema:Schema = new this.mongoose.Schema<MongoEmergencyCaseEntity>({
        //     remoteCaseId:String,
        //     actions: Array
        // });
        // let emergencyCaseModel:Model<MongoEmergencyCaseEntity> = this.connection.model<MongoEmergencyCaseEntity>('emergencyCase',emergencyCaseSchema,'emergencyCase');
        // this.models.set('emergencyCase',emergencyCaseModel);
    }

    private getCollection<T>(collectionName: string):Model<T>{
        let collection:Model<T> = this.models.get(collectionName);
        if(!collection){
            let schema:Schema = new this.mongoose.Schema<T>();
            collection = this.connection.model<T>(collectionName,schema,collectionName);
            this.models.set(collectionName,collection);

            if(!collection){
                throw new Error(`${collectionName} - collection instance is not existed`);
            }
        }
        return collection;
    }

    async insert<T> (doc: OptionalUnlessRequiredId<T>, options: InsertOneOptions): Promise<InsertOneResult<T>> {

        let collection:Model<T> =  this.getCollection(options.dbName);
        let modelInstance:HydratedDocument<T> = new collection();
        Object.assign(modelInstance,doc);
        let result = await modelInstance.save();
        return ;
    }

    update<T> (filter: Filter<T>, update: UpdateFilter<T> | Partial<T>, options?: UpdateOptions): Promise<UpdateResult<T>> {

        return ;
    }






    // async insert<T>(dbName: string, collectionName: string, data: T): Promise<string> {
    //     let collection:Model<T> =  this.getCollection<T>(collectionName);
    //     let modelInstance:HydratedDocument<T> = new collection();
    //     Object.assign(modelInstance,data);
    //     let result = await modelInstance.save();
    //     return result.id.toString();
    // }

    // async update<T>(dbName: string, collectionName: string, primaryKey: {}, data: T): Promise<UpdateResult> {
    //     let collection:Model<T> =  this.getCollection<T>(collectionName);
    //     let modelInstance:HydratedDocument<T> = new collection();
    //     let u:UpdateResult = await modelInstance.updateOne(primaryKey,data);
    //     return u;
    // }
    //
    // async find<T>(dbName: string, collectionName: string, primaryKey: {}): Promise<T> {
    //     let collection:Model<T> =  this.getCollection<T>(collectionName);
    //     let t:T = await collection.findOne<T>(primaryKey).exec();
    //     return t;
    // }

    close () {

    }

    isClosed (): boolean {

        return true;
    }

    open (): boolean {
        return true;
    }
}