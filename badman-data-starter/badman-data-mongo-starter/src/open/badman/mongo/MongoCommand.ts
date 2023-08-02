

import {
	AggregateOptions, Document,
	Filter, FindOneAndUpdateOptions,
	FindOptions,
	InsertOneOptions, ModifyResult,
	OptionalUnlessRequiredId,
	UpdateFilter,
	UpdateOptions,
	UpdateResult
} from "mongodb";


export default interface MongoCommand{

	find<T>(dbName:string,collectionName:string,filter?: Filter<T>, options?: FindOptions): Promise<T[]>;

	findOne<T>(dbName:string,collectionName:string,filter?: Filter<T>, options?: FindOptions): Promise<T>;

    insert<T>(dbName:string,collectionName:string,doc: OptionalUnlessRequiredId<T>, options?: InsertOneOptions):Promise<string>;

    update<T>(dbName:string,collectionName:string,filter: Filter<T>, update: UpdateFilter<T> | Partial<T>, options?: UpdateOptions):Promise<UpdateResult<T>>;

	aggregate<T>(dbName:string,collectionName:string,pipeline?: T[], options?: AggregateOptions): Promise<T[]>;

	findOneAndUpdate<T extends Document = Document>(dbName:string,collectionName:string,filter: Filter<T>, update: UpdateFilter<T>, options?: FindOneAndUpdateOptions): Promise<ModifyResult<T>>

    // bulkWrite(operations:any[],setting:any);

}