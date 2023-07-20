
import {Logging, SingletonObjectFactory2} from "badman-core";
import * as console from "console";
import {Logger} from "log4js";
import LocalConfigurer from "../open/badman/configuration/local/LocalConfigurer";
import NacosConfigurer from "../open/badman/configuration/nacos/NacosConfigurer";
import NacosProperties from "../open/badman/configuration/nacos/NacosProperties";


export default class TestLocal {

	constructor () {
		process.on('beforeExit', (code) => {
			console.log('Process beforeExit event with code: ', code);
		});

		process.on('exit', (code) => {
			console.log('Process exit event with code: ', code);
		});
	}

	async main(this:TestLocal){


		await SingletonObjectFactory2.init(LocalConfigurer);

		let logging:Logging =  await SingletonObjectFactory2.initWithArgs(Logging,['nacos_configuration_log4js_properties.json']);
		let logger:Logger = logging.logger(TestLocal.name);
		//logger.info(`${process.cwd()}\r\n`);

		logger.info(process.env['APPLICATION_NAME']);


		// let nacosProperties:NacosProperties = {
		// 	serverAddr: LocalConfigurer.getEnvironmentValue('NACOS_ADDRESS'),
		// 	namespace: LocalConfigurer.getEnvironmentValue('NACOS_NAMESPACE'),
		// 	username : LocalConfigurer.getEnvironmentValue('NACOS_USERNAME'),
		// 	password : LocalConfigurer.getEnvironmentValue('NACOS_PASSWORD'),
		// };
		let nacosProperties:NacosProperties = this.nacosProperties();

		// nacosProperties.subscribed=true;
		// nacosProperties.subscribeScript=
		// 	'const refresh = (newContent) => {\n' +
		// 	//'  console.log(\'receive : \',newContent);\n' +
		// 	'  if(newContent){process.exit(9000);}\n' +
		// 	'}\n' +
		// 	'return {refresh};'

		let nacosConfigurer:NacosConfigurer = await SingletonObjectFactory2.initWithArgs(NacosConfigurer,[nacosProperties,logger]);
		// let a:A = nacosConfigurer.get<A>('baidu.map')
		// logger.info(a);

		nacosConfigurer.subscribe((c)=>{
			console.info('---------',c);
		});

	}

	private nacosProperties():NacosProperties{
		let nacosProperties:NacosProperties = {
			ssl : !!LocalConfigurer.getEnvironmentValue('NACOS_ENABLE_SSL'),
			//endpoint: LocalConfigurer.getEnvironmentValue('NACOS_ENDPOINT'),
			serverAddr: LocalConfigurer.getEnvironmentValue('NACOS_ENDPOINT'),
			serverPort: parseInt(LocalConfigurer.getEnvironmentValue('NACOS_PORT')),
			namespace: LocalConfigurer.getEnvironmentValue('NACOS_NAMESPACE'),
			username : LocalConfigurer.getEnvironmentValue('NACOS_USERNAME'),
			password : LocalConfigurer.getEnvironmentValue('NACOS_PASSWORD'),
		};
		return nacosProperties;
	}

}


interface A{
	ak:string;
	apis: B;
}

interface B{
	transferGpsApi:string;
}

(async ()=>{
	await new TestLocal().main();
})();




