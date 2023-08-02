

import {Disposable, Initializing} from "badman-core";
import {Logger} from "log4js";
import ClientMongoFactory from "../../ClientMongoFactory";
import MongoProperties from "../../MongoProperties";
import MultiMongoProperties from "../../MultiMongoProperties";
import ClientMongooseConnection from "./ClientMongooseConnection";
import M, {Connection, ConnectOptions, Mongoose} from "mongoose";
import AbstractClientMongoFactory from "../AbstractClientMongoFactory";


export default class ClientMongooseFactory extends AbstractClientMongoFactory implements ClientMongoFactory<any>,Initializing,Disposable {


    private dbs:Map<string,Connection>;


    private readonly mongoose:Mongoose;


    private constructor(multiMongoProperties:MultiMongoProperties,logger?:Logger) {
        super(multiMongoProperties,logger);
        this.mongoose = new Mongoose();
    }


   async afterInitialized () {
        if(this.multiMongoProperties){
            this.dbs = new Map<string, Connection>();
            for (let dbName in this.multiMongoProperties) {
                let mongoProperties:MongoProperties = this.multiMongoProperties[dbName];
                let url:string = mongoProperties.url;
                let options:ConnectOptions = <ConnectOptions>mongoProperties.properties;
                options.dbName = dbName;
                let connection:Connection = await M.createConnection(url,options);
                //let mongoose:Mongoose = await M.connect(url,options);
                this.dbs.set(dbName,connection);
                this.logger.info(`加载完成 - ${url}`);
                connection.on('reconnected', msg => {
                    this.logger.info(`Mongoose reconnected successfully,${msg}`);
                });
            }
        }
    }

    async createConnection(dbName:string,collectionName:string): Promise<ClientMongooseConnection> {
        let connection:Connection = this.dbs.get(dbName);
        return new ClientMongooseConnection(connection,this.mongoose);
    }

    async close() {

    }

    async destroy () {
    }
}