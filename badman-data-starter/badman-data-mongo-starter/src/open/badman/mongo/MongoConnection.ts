

import {
	BulkWriteOptions, DeleteOptions, DeleteResult,
	Filter, FindCursor, FindOptions, InsertManyResult,
	InsertOneOptions,
	InsertOneResult,
	OptionalUnlessRequiredId, UpdateFilter, UpdateOptions,
	UpdateResult,AggregateOptions,AggregationCursor
} from "mongodb";


export default interface MongoConnection{


	insert<T>(doc: OptionalUnlessRequiredId<T>, options?: InsertOneOptions):Promise<InsertOneResult<T>>;

	insertMany<T>(docs: OptionalUnlessRequiredId<T>[], options?: BulkWriteOptions): Promise<InsertManyResult<T>>;

	update<T>(filter: Filter<T>, update: UpdateFilter<T> | Partial<T>, options?: UpdateOptions): Promise<UpdateResult<T>>;

	updateMany<T>(filter: Filter<T>, update: UpdateFilter<T>, options?: UpdateOptions): Promise<UpdateResult<T>>;

	delete<T>(filter?: Filter<T>, options?: DeleteOptions): Promise<DeleteResult>;

	deleteMany<T>(filter?: Filter<T>, options?: DeleteOptions): Promise<DeleteResult>;

	findOne<T>(filter: Filter<T>, options?: FindOptions): Promise<T | null>;
	//
	find<T>(filter: Filter<T>, options?: FindOptions): FindCursor<T>;

	aggregate<T>(pipeline?: T[], options?: AggregateOptions): AggregationCursor<T>;

	// estimatedDocumentCount();
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



	close();

	isClosed():boolean;

	open():boolean;



}