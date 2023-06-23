
import {
    BulkWriteOptions,
    Collection, CountOptions,
    Db, DeleteOptions, DeleteResult, Document,
    Filter, FindCursor, FindOptions,
    InsertManyResult,
    InsertOneOptions,
    InsertOneResult,
    OptionalUnlessRequiredId,
    UpdateFilter,
    UpdateOptions,
    UpdateResult,
    WithId,
    AggregateOptions, AggregationCursor
} from "mongodb";
import MongoConnection from "../../MongoConnection";


export default class ClientSimpleMongoConnection implements MongoConnection {

    private db: Db;

    private collection: Collection;

    constructor(db: Db,collection: Collection) {
        this.db = db;
        this.collection = collection;
    }


    insert<T extends Document = Document> (doc: OptionalUnlessRequiredId<T>, options?: InsertOneOptions): Promise<InsertOneResult<T>> {
        return this.collection.insertOne(doc,options);
    }

    insertMany<T extends Document = Document> (docs: OptionalUnlessRequiredId<T>[], options?: BulkWriteOptions): Promise<InsertManyResult<T>> {
        return this.collection.insertMany(docs,options);
    }

    update<T extends Document = Document> (filter: Filter<T>, update: UpdateFilter<T> | Partial<T>, options?: UpdateOptions): Promise<UpdateResult<T>> {
        return this.collection.updateOne(filter,update,options);
    }

    updateMany<T extends Document = Document>(filter: Filter<T>, update: UpdateFilter<T>, options?: UpdateOptions): Promise<UpdateResult<T>>{
        return this.collection.updateMany(filter,update,options);
    }

    delete<T extends Document = Document>(filter?: Filter<T>, options?: DeleteOptions): Promise<DeleteResult>{
        return this.collection.deleteOne(filter,options);
    }

    deleteMany<T extends Document = Document>(filter?: Filter<T>, options?: DeleteOptions): Promise<DeleteResult>{
        return this.collection.deleteMany(filter,options);
    }

    aggregate<T>(pipeline?: T[], options?: AggregateOptions): AggregationCursor<T>{
        return this.collection.aggregate(pipeline,options);
    }

    findOne<T>(filter: Filter<T>, options?: FindOptions): Promise<T | null>{
        // @ts-ignore
        return this.collection.findOne(filter,options);
    }

    find<T>(filter: Filter<T>, options?: FindOptions): FindCursor<T>{
        // @ts-ignore
        return this.collection.find(filter,options);
    }

    // findOne<T extends Document = Document>(filter: Filter<T>, options: FindOptions): Promise<WithId<T> | null>{
    //     // @ts-ignore
    //     return this.collection.findOne(filter,options);
    // }

    // find<T>(filter: Filter<T>, options?: FindOptions): FindCursor<WithId<T>>{
    //
    //     return this.collection.find(filter,options);
    // }
    //




    // estimatedDocumentCount(){
    //     return this.collection.estimatedDocumentCount();
    // }
    //
    // countDocuments();
    //
    // namespace();
    //
    // bulkWrite();
    //
    // drop();
    //
    // createIndexes();
    //
    // dropIndexes();
    //
    // listIndexes();
    //
    // indexExists();
    //
    // indexInformation();





    // async insert<T>(dbName: string, collectionName: string, data: T): Promise<string> {
    //     let result: InsertOneResult<T> = await this.collection.insertOne(data);
    //     return result.insertedId.toString();
    // }
    //
    // async update<T>(dbName:string,collectionName:string,primaryKey:{},data:T):Promise<UpdateResult> {
    //     let u:UpdateResult = await this.collection.updateOne(primaryKey,data,{upsert:true});
    //     return u;
    // }
    //
    // find<T>(dbName: string, collectionName: string, primaryKey: {}): Promise<T> {
    //    return this.collection.findOne<T>(primaryKey);
    // }
    //
    // list() {
    //
    // }
    //
    // async bulkWrite (operations: AnyBulkWriteOperation<any>[], options?: BulkWriteOptions) {
    //
    //    let bulkWriteResult:BulkWriteResult =  await this.collection.bulkWrite([
    //        {
    //            updateOne:{
    //                filter:{roomId:null},
    //                update:[{
    //                    $pull:{logs:{$in:{}}},
    //
    //                }]
    //            }
    //        }
    //    ],options);
    //    return bulkWriteResult;
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