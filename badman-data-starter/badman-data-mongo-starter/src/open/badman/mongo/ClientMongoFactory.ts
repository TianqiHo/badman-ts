

import MongoConnection from "./MongoConnection";


export default interface ClientMongoFactory<C extends MongoConnection>{


    createConnection(dbName:string,collectionName:string):Promise<C>;

    close();
}