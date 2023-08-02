
import {Beans, Logging} from "badman-core";
import * as console from "console";
import {Logger} from "log4js";
import LocalConfigurer from "../open/badman/configuration/local/LocalConfigurer";
import NacosConfigurer from "../open/badman/configuration/nacos/NacosConfigurer";
import NacosProperties from "../open/badman/configuration/nacos/NacosProperties";


export default class TestLocalWithBeans {

	constructor () {
		process.on('beforeExit', (code) => {
			console.log('Process beforeExit event with code: ', code);
		});

		process.on('exit', (code) => {
			console.log('Process exit event with code: ', code);
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


	main(){

		let logger:Logger = Beans.LoadBean<Logging>({
			constructor:Logging,
			args:[
				'nacos_configuration_log4js_properties.json'
			]
		}).logger();

		Beans.LoadBean<LocalConfigurer>({
			constructor:LocalConfigurer
		});

		new Promise<void>(async (resolve, reject)=>{

			let nacos:NacosConfigurer = Beans.LoadBean<NacosConfigurer>({
				constructor:NacosConfigurer,
				beanName: 'nacosConfigurer',
				lazyInit:false,
				args:[
					this.nacosProperties(),
					logger
				]
			});
			await nacos.flash();
			resolve();

		}).then(ok=>{
			logger.info('Get...............');
			let nacos:NacosConfigurer = Beans.Instance<NacosConfigurer>('nacosConfigurer');
			logger.info(nacos.get<string>('uuid.snowflake.baseTime'));
			logger.info('Get...............');

			setTimeout(async ()=>{
				await nacos.destroy();
			},3000);

		},err=>{
			logger.error('catch -> ',err);
		});

	}

}

(async ()=>{
	new TestLocalWithBeans().main();
})();




