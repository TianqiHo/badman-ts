

import {Initializing} from "badman-core";
import * as console from "console";
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

                if(url.split('@').length>=3){
                    throw new Error(`The url ${url} is invalid , @ is the key word`);
                }
                let properties:MongoClientOptions = <MongoClientOptions>mongoProperties.properties;
                if(!properties.appName){
                    properties.appName = appName;
                }
                let mongoClient:MongoClient = new MongoClient(url,properties);

                // mongoClient.on('connectionReady',()=>{
                //     this.logger.info('-------------connectionReady------------');
                // });
                //
                // mongoClient.on('commandStarted',()=>{
                //     this.logger.info('-------------commandStarted------------');
                // });
                // mongoClient.on('commandSucceeded', (event) => console.debug(event));
                // mongoClient.on('commandFailed', (event) => console.debug(event));
                this.mongoClients.set(dbName,mongoClient);

                try {
                    let db: Db = mongoClient.db(dbName);
                    if(mongoProperties.validate){
                        await db.command({ping:1});
                        this.logger.info(`The db[${dbName}] connect successfully`);
                    }
                    this.dbs.set(dbName, db);
                } catch (e) {
                    this.logger.error('---------',e);
                    throw e;
                }
            }

        }
    }

    async createConnection(dbName:string,collectionName:string): Promise<ClientSimpleMongoConnection> {
        let db:Db = this.dbs.get(dbName);
        if(!db){
            throw new Error(`There is none unavailable db instance for ${dbName},please check properties‘dbs attribute`);
        }

        let collection:Collection = db.collection(collectionName);
        if(!collection){
            throw new Error(`There is none unavailable collection instance for ${collectionName}`);
        }
        return new ClientSimpleMongoConnection(db,collection);
    }

    close() {
        for (let dbName in this.mongoClients) {
            let client: MongoClient = this.mongoClients[dbName];
            client.close(false);
        }
    }


}