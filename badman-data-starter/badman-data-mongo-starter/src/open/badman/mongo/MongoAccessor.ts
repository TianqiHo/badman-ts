


import ClientMongoFactory from "./ClientMongoFactory";
import MongoConnection from "./MongoConnection";


export default abstract class MongoAccessor {


    protected clientMongoFactory:ClientMongoFactory<MongoConnection>;

    protected constructor(clientMongoFactory:ClientMongoFactory<MongoConnection>) {

        if(clientMongoFactory){
            this.clientMongoFactory = clientMongoFactory;
        }else{
            throw new Error('ClientMongoFactory can not be null');
        }
    }

    protected async createConnection(dbName:string,collectionName:string):Promise<MongoConnection>{
        let mongoConnection:MongoConnection = await this.clientMongoFactory.createConnection(dbName,collectionName);
        return mongoConnection;
    }

}