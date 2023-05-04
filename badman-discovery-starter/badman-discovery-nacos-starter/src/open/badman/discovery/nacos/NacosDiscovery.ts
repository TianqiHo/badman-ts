

import {Initializing, NetParser, RoundRobinLoadBalancer, WeightValue} from "badman-core";
import {Hosts, NacosNamingClient} from "nacos-naming";
import NacosInstanceProperties from "./NacosInstanceProperties";
import NacosServerProperties from "./NacosServerProperties";


export default class NacosDiscovery implements Initializing{

	private client:NacosNamingClient;

	private loadBalanceMapping:Map<string,RoundRobinLoadBalancer<Host>>;

	private readonly autoRegistrySelf:boolean;

	private readonly localServerAddr:string = 'localhost:8848';

	private readonly defaultNamespace:string = 'default';

	private readonly defaultUsername:string = 'nacos';

	private readonly defaultPassword:string = 'nacos';

	private readonly serverProperties:NacosServerProperties;

	constructor(autoRegistrySelf:boolean,serverProperties:NacosServerProperties) {
		if(autoRegistrySelf !==undefined || autoRegistrySelf !== null){
			this.autoRegistrySelf = autoRegistrySelf;
		}else{
			this.autoRegistrySelf = true;
		}

		this.serverProperties = serverProperties;
		this.loadBalanceMapping = new Map<string, RoundRobinLoadBalancer<Host>>();

		if(this.serverProperties && this.serverProperties.serverList && this.serverProperties.namespace){
			this.client = new NacosNamingClient(this.serverProperties);
		}else{
			let logger = console;
			let address:string = this.localServerAddr;
			let namespace:string = this.defaultNamespace;
			let defaultServerProperties:NacosServerProperties = {logger: logger,serverList:address,namespace:namespace};
			this.client = new NacosNamingClient(defaultServerProperties);
		}
	}

	async afterInitialized () {
		await this.client.ready();
		if(this.autoRegistrySelf){

			let ipv4:string | undefined = this.serverProperties.thisServerIp;
			if(!ipv4){
				//ipv4 = new NetParser().parseIPV4Address();
				ipv4 = '0.0.0.0';
			}

			let port:number | undefined = this.serverProperties.thisServerPort;
			if(!port){
				throw new Error('注册Nacos Service失败,服务端口无效');
			}

			let serverName:string | undefined = this.serverProperties.thisServerName;
			if(!serverName){
				throw new Error('注册Nacos Service失败,服务名称无效');
			}

			await this.client.registerInstance( serverName,{ip:ipv4,port:port});
		}

	}

	// public async registerInstance(instanceProperties:NacosInstanceProperties){
	// 	await this.client.registerInstance(instanceProperties.serviceName,instanceProperties.instance,instanceProperties.groupName);
	// }

	public async obtainInstance(instanceProperties:NacosInstanceProperties):Promise<string>{
		let runtimeHosts:Hosts = await this.client.getAllInstances(instanceProperties.serviceName,
			instanceProperties.groupName,instanceProperties.clusters,instanceProperties.subscribe);

		if(runtimeHosts.length>0){
			let hosts:WeightValue<Host>[] = this.addAddress(runtimeHosts);
			if(hosts.length>0){
				if(!this.loadBalanceMapping.get(instanceProperties.serviceName)){
					let roundRobinLoadBalancer:RoundRobinLoadBalancer<Host> = new RoundRobinLoadBalancer(hosts,false);
					this.loadBalanceMapping.set(instanceProperties.serviceName,roundRobinLoadBalancer);
				}
				let roundRobinLoadBalancer:RoundRobinLoadBalancer<Host> | undefined = this.loadBalanceMapping.get(instanceProperties.serviceName);
				if(roundRobinLoadBalancer){
					let host:WeightValue<Host> = roundRobinLoadBalancer.pick();
					return host.value.custom.split('~')[0];
				}
				return null;

			}else{
				this.loadBalanceMapping.delete(instanceProperties.serviceName);
			}

		}
		return null;
	}

	public async subscribeInstance(serviceName: string, groupName?: string,clusters?: string){
		this.client.subscribe({serviceName:serviceName,groupName:groupName,clusters:clusters},hosts=>{
			let healthyHosts:WeightValue<Host>[] = this.addAddress(hosts);
			if(healthyHosts.length>0){
				let serviceName:string = healthyHosts[0].value.serviceName.split('@@')[1];
				let existedLoadBalance:RoundRobinLoadBalancer<Host>|undefined;
				if((existedLoadBalance = this.loadBalanceMapping.get(serviceName))){

					if(existedLoadBalance.poolSize() != healthyHosts.length){
						let roundRobinLoadBalancer:RoundRobinLoadBalancer<Host> = new RoundRobinLoadBalancer(healthyHosts,false);
						this.loadBalanceMapping.set(serviceName,roundRobinLoadBalancer);
					}else {
						let add: boolean = false;
						let olds:WeightValue<Host>[] = existedLoadBalance.existedPool();

						let existInstanceId:string[] = olds.map<string>((weightValue)=>{
							return weightValue.value.instanceId;
						});

						for (let healthyHost of healthyHosts) {
							if (!existInstanceId.includes(healthyHost.value.instanceId, 0)) {
								add=true;
								break;
							}
						}

						if (add) {
							let roundRobinLoadBalancer:RoundRobinLoadBalancer<Host> = new RoundRobinLoadBalancer(healthyHosts,false);
							this.loadBalanceMapping.set(serviceName, roundRobinLoadBalancer);
						}
					}

				}else{
					let roundRobinLoadBalancer:RoundRobinLoadBalancer<Host> = new RoundRobinLoadBalancer(healthyHosts,false);
					this.loadBalanceMapping.set(serviceName,roundRobinLoadBalancer);
				}
			}
		});
	}

	private addAddress(runtimeHosts:Object[]):WeightValue<Host>[]{
		let healthyHosts:WeightValue<Host>[]=[];
		for (let runtimeHost of runtimeHosts) {

			let host:Host = <Host>runtimeHost;
			if(host.healthy){
				host.custom = `http://${host.ip}:${host.port}~${host.instanceId}`;
				healthyHosts.push({value:host});
			}
		}
		return healthyHosts;
	}

}

interface Host {
	instanceId: string;//"192.168.1.24#8808#DEFAULT#DEFAULT_GROUP@@web_server",
	ip: string;//"192.168.1.24",
	port: string;//8808,
	weight:string; //1,
	healthy: boolean;//true,
	enabled: boolean; //true,
	ephemeral: boolean;
	clusterName: string; //"DEFAULT",
	serviceName: string;//"DEFAULT_GROUP@@web_server",
	metadata:{},
	instanceHeartBeatInterval: number;//5000,
	instanceHeartBeatTimeOut: number; //15000,
	ipDeleteTimeout: number;//30000,
	instanceIdGenerator: string;//"simple"

	custom:string;
}