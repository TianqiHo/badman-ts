


import {Logging, SingletonObjectFactory2} from "badman-core";
import {Logger} from "log4js";
import MongoTemplate from "./open/badman/mongo/MongoTemplate";
import MongoProperties from "./open/badman/mongo/MongoProperties";
import MultiMongoProperties from "./open/badman/mongo/MultiMongoProperties";
import ClientSimpleMongoFactory from "./open/badman/mongo/clients/mongo/ClientSimpleMongoFactory";
import ClientSimpleMongoConnection from "./open/badman/mongo/clients/mongo/ClientSimpleMongoConnection";
import ClientMongoFactory from "./open/badman/mongo/ClientMongoFactory";
import MongoCommand from "./open/badman/mongo/MongoCommand";
import MongoConnection from "./open/badman/mongo/MongoConnection";


export default class BadmanMongo {

	async main(){

		let logging:Logging =  await SingletonObjectFactory2.init<Logging>(Logging);

		let logger:Logger = logging.logger(BadmanMongo.name);

		let testMongo:MongoProperties = {
			"url":"mongodb://emergency:emergency@127.0.0.1:27017/",
			"properties":{
				"connectTimeoutMS":1000,
				"socketTimeoutMS": 5000,
				"compressors":"none",
				"maxPoolSize": 10,
				"minPoolSize": 2,
				"maxConnecting": 5,
				"maxIdleTimeMS": 2000,
				"waitQueueTimeoutMS": 6000
			}
		};
		let defaultProperties:MultiMongoProperties = {
			appName: (+Date.now()).toString(),
			dbs: {
				"emergency": testMongo
			}
		}

		let simpleMongoFactory:ClientSimpleMongoFactory = await SingletonObjectFactory2.initWithArgs<ClientSimpleMongoFactory>(ClientSimpleMongoFactory,[defaultProperties,logger]);

		await SingletonObjectFactory2.initWithArgs<MongoTemplate>(MongoTemplate,[simpleMongoFactory]);

		//{_id:'642e400959fab30c07cf43fc'}
		console.info(await SingletonObjectFactory2.Instance<MongoTemplate>(MongoTemplate.name).find<any>('emergency','emergencyCase',{remoteCaseId:'421543318306885'}));
	}
}

// (()=>{
// 	new BadmanMongo().main();
// })();

export {
	MongoTemplate,
	ClientSimpleMongoFactory,
	ClientSimpleMongoConnection,
	MultiMongoProperties,
	MongoProperties,
	ClientMongoFactory,
	MongoCommand,
	MongoConnection
}