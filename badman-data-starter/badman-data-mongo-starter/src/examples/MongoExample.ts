

import {Logging, SingletonObjectFactory2} from "badman-core";
import * as console from "console";
import {Logger} from "log4js";
import {ObjectId, UpdateResult} from "mongodb";
import ClientSimpleMongoFactory from "../open/badman/mongo/clients/mongo/ClientSimpleMongoFactory";
import MongoProperties from "../open/badman/mongo/MongoProperties";
import MongoTemplate from "../open/badman/mongo/MongoTemplate";
import MultiMongoProperties from "../open/badman/mongo/MultiMongoProperties";


export default class MongoExample {

	async main(){

		let logging:Logging =  await SingletonObjectFactory2.init<Logging>(Logging);

		let logger:Logger = logging.logger(MongoExample.name);

		let testMongo:MongoProperties = {
			url:"mongodb://emergency:emergency@local:17027",
			validate: true,
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
				"greenlane_v3_dev": testMongo
			}
		}

		let simpleMongoFactory:ClientSimpleMongoFactory = await SingletonObjectFactory2.initWithArgs<ClientSimpleMongoFactory>(ClientSimpleMongoFactory,[defaultProperties,logger]);

		await SingletonObjectFactory2.initWithArgs<MongoTemplate>(MongoTemplate,[simpleMongoFactory,logger]);

		//,_id: new ObjectId('649016c9ca5ebd182c076e41')
		let tt:any[]= await SingletonObjectFactory2.Instance<MongoTemplate>(MongoTemplate.name).find<any>(
			'greenlane_v3_dev',
			'emergency_case',
			{caseId:'23ee6e5ea6c74515bff9abdd6ccccfaa'});

		logger.info('find ->',tt);

		setTimeout(async ()=>{
			await SingletonObjectFactory2.Instance<MongoTemplate>(MongoTemplate.name).destroy();
		},3000);



		//let tt:any= await SingletonObjectFactory2.Instance<MongoTemplate>(MongoTemplate.name).findOne<any>('greenlane_v3_dev','demo',{_id: new ObjectId('649016c9ca5ebd182c076e41')});

		// let doc:OptionalUnlessRequiredId<any> = {
		// 	name: 123,
		// 	logs:[],
		// 	sendTime: new Date(),
		// 	roomId: 1
		// }
		//
		// let tt1:string = await SingletonObjectFactory2.Instance<MongoTemplate>(MongoTemplate.name).insert('greenlane_v3_dev','demo',{});
		//
		//
		// let tt2:UpdateResult = await SingletonObjectFactory2.Instance<MongoTemplate>(MongoTemplate.name).update(
		// 	'greenlane_v3_dev','demo',
		// 	{_id:{$eq: new ObjectId('64913b189c8a4eaf6a8815f3')}},
		// 	{
		// 		$set:{roomId:222}
		// 	});
		//
		// console.error(tt2);
		//
		// let tt:any[] = await SingletonObjectFactory2.Instance<MongoTemplate>(MongoTemplate.name).aggregate(
		// 	'greenlane_v3_dev','chat_log',
		// 	[
		// 		{
		// 			$match: {
		// 				roomId: '1',
		// 				"logs.sendTime": {$gte: '2023-06-22 10:56:44.162'}
		// 			}
		// 		},
		// 		{
		// 			$unwind: '$logs'
		// 		},
		// 		{
		// 			$match: {
		// 				roomId: '1',
		// 				"logs.sendTime": {$gte: '2023-06-22 10:56:44.162'}
		// 			}
		// 		},
		// 		{
		// 			$group: {
		//
		// 				_id: '$_id',
		// 				roomId: {
		// 					$first: '$roomId'
		// 				},
		// 				logs: {
		// 					$push: '$logs'
		// 				}
		// 			}
		// 		}
		// 	]
		// );
		//
		// console.error(tt);
		//
		//  await SingletonObjectFactory2.Instance<MongoTemplate>(MongoTemplate.name).findOneAndUpdate(
		// 	'greenlane_v3_dev','chat_log',
		// 	{},
		// 	{}
		// 	);
	
	}
}

(()=>{
	new MongoExample().main();
})();
