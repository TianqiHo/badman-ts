

import MongoConnection from "../../MongoConnection";
import {Connection, HydratedDocument, Model, Mongoose, Schema} from "mongoose";
import {UpdateResult} from "mongodb";


export default class ClientMongooseConnection implements MongoConnection{

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
            throw new Error(`${collectionName} - collection instance is not existed`);
        }
        return collection;
    }
    async insert<T>(dbName: string, collectionName: string, data: T): Promise<string> {
        let collection:Model<T> =  this.getCollection<T>(collectionName);
        let modelInstance:HydratedDocument<T> = new collection();
        Object.assign(modelInstance,data);
        let result = await modelInstance.save();
        return result.id.toString();
    }

    async update<T>(dbName: string, collectionName: string, primaryKey: {}, data: T): Promise<UpdateResult> {
        let collection:Model<T> =  this.getCollection<T>(collectionName);
        let modelInstance:HydratedDocument<T> = new collection();
        let u:UpdateResult = await modelInstance.updateOne(primaryKey,data);
        return u;
    }

    async find<T>(dbName: string, collectionName: string, primaryKey: {}): Promise<T> {
        let collection:Model<T> =  this.getCollection<T>(collectionName);
        let t:T = await collection.findOne<T>(primaryKey).exec();
        return t;
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