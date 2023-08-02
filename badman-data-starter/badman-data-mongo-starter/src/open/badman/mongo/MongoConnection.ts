

import {
	BulkWriteOptions,
	DeleteOptions,
	DeleteResult,
	Filter,
	FindCursor,
	FindOptions,
	InsertManyResult,
	InsertOneOptions,
	InsertOneResult,
	OptionalUnlessRequiredId,
	UpdateFilter,
	UpdateOptions,
	UpdateResult,
	AggregateOptions,
	AggregationCursor,
	WithoutId,
	FindOneAndReplaceOptions,
	ModifyResult,
	FindOneAndUpdateOptions, Document, WithId
} from "mongodb";


export default interface MongoConnection{


	insert<T extends Document>(doc: OptionalUnlessRequiredId<T>, options?: InsertOneOptions):Promise<InsertOneResult<T>>;

	insertMany<T extends Document >(docs: OptionalUnlessRequiredId<T>[], options?: BulkWriteOptions): Promise<InsertManyResult<T>>;

	update<T extends Document>(filter: Filter<T>, update: UpdateFilter<T> | Partial<T>, options?: UpdateOptions): Promise<UpdateResult<T>>;

	updateMany<T extends Document>(filter: Filter<T>, update: UpdateFilter<T>, options?: UpdateOptions): Promise<UpdateResult<T>>;

	delete<T extends Document>(filter?: Filter<T>, options?: DeleteOptions): Promise<DeleteResult>;

	deleteMany<T extends Document>(filter?: Filter<T>, options?: DeleteOptions): Promise<DeleteResult>;

	findOneAndReplace<T extends Document>(filter: Filter<T>, replacement: WithoutId<T>, options?: FindOneAndReplaceOptions): Promise<ModifyResult<T>>;

	findOneAndUpdate<T extends Document>(filter: Filter<T>, update: UpdateFilter<T>, options?: FindOneAndUpdateOptions): Promise<ModifyResult<T>>;

	findOne<T extends Document>(filter: Filter<T>, options?: FindOptions): Promise<T | null>;
	//
	find<T extends Document>(filter: Filter<T>, options?: FindOptions): FindCursor<T>;

	aggregate<T extends Document = Document>(pipeline?: T[], options?: AggregateOptions): AggregationCursor<T>;



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