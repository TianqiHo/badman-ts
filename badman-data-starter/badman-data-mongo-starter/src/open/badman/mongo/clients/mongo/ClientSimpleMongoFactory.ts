

import {Initializing} from "badman-core";
import {Logger} from "log4js";
import ClientMongoFactory from "../../ClientMongoFactory";
import MongoProperties from "../../MongoProperties";
import MultiMongoProperties from "../../MultiMongoProperties";
import ClientSimpleMongoConnection from "./ClientSimpleMongoConnection";
import AbstractClientMongoFactory from "../AbstractClientMongoFactory";
import {Collection, Db, MongoClient, MongoClientOptions} from "mongodb";


export default class ClientSimpleMongoFactory extends AbstractClientMongoFactory implements ClientMongoFactory<ClientSimpleMongoConnection>,Initializing {

    private readonly mongoClients:Map<string,MongoClient>;

    private readonly dbs:Map<string,Db>;

    constructor(multiMongoProperties:MultiMongoProperties,logger:Logger) {
        super(multiMongoProperties,logger);
        this.mongoClients = new Map<string,MongoClient>();
        this.dbs = new Map<string, Db>();
    }


    async afterInitialized () {
        if(this.multiMongoProperties){

            let appName:string = (+Date.now()).toString();
            if(this.multiMongoProperties.appName){
                appName = this.multiMongoProperties.appName;
            }

            for (let dbName in this.multiMongoProperties.dbs) {

                let mongoProperties:MongoProperties = this.multiMongoProperties.dbs[dbName];

                let url:string = mongoProperties.url;
                let properties:MongoClientOptions = <MongoClientOptions>mongoProperties.properties;
                if(!properties.appName){
                    properties.appName = appName;
                }
                let mongoClient:MongoClient = new MongoClient(url,properties);
                this.mongoClients.set(dbName,mongoClient);

                let db:Db = mongoClient.db(dbName);
                this.dbs.set(dbName,db);
            }

        }
    }

    async createConnection(dbName:string,collectionName:string): Promise<ClientSimpleMongoConnection> {
        let db:Db = this.dbs.get(dbName);
        let collection:Collection = db.collection(collectionName);
        return new ClientSimpleMongoConnection(db,collection);
    }

    close() {
        for (let dbName in this.mongoClients) {
            let client: MongoClient = this.mongoClients[dbName];
            client.close(false);
        }
    }


}