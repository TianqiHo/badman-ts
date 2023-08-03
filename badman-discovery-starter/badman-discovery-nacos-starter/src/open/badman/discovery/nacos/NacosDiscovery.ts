

import {
	Disposable,
	NetParser,
	RoundRobinLoadBalancer, SyncInitializing,
	WeightValue
} from "badman-core";
import {Hosts, NacosNamingClient} from "nacos-naming";
import NacosInstanceProperties from "./NacosInstanceProperties";
import NacosServerProperties from "./NacosServerProperties";


export default class NacosDiscovery implements SyncInitializing,Disposable{

	private readonly client:NacosNamingClient;

	private loadBalanceMapping:Map<string,RoundRobinLoadBalancer<Host>>;

	private readonly autoRegistrySelf:boolean;

	private readonly localServerAddr:string = 'localhost:8848';

	private readonly defaultNamespace:string = 'default';

	private readonly defaultUsername:string = 'nacos';

	private readonly defaultPassword:string = 'nacos';

	private readonly serverProperties:NacosServerProperties;

	private logger:any;

	constructor(autoRegistrySelf:boolean,serverProperties:NacosServerProperties) {
		this.logger = serverProperties.logger;

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
			serverProperties.logger = logger;
			serverProperties.serverList = address;
			serverProperties.namespace = namespace;
			this.client = new NacosNamingClient(serverProperties);
		}
	}

	async afterInitialized () {
		await this.client.ready();
		if(this.autoRegistrySelf){
			let port:number | undefined = this.serverProperties.thisServerPort;
			if(!port){
				throw new Error('Invalidate port property');
			}

			let serverName:string | undefined = this.serverProperties.thisServerName;
			if(!serverName){
				throw new Error('Invalidate serviceName property');
			}

			let ipv4:string | undefined = this.serverProperties.thisServerIp;
			if(!ipv4){
				ipv4 = new NetParser().parseIPV4Address();
			}

			await this.client.registerInstance( serverName,{ip:ipv4,port:port});
			this.logger.info('Local register successfully,ip:%s, port:%s, serverName:%s',ipv4,port,serverName);
		}

	}

	public async obtainInstance(instanceProperties:NacosInstanceProperties):Promise<string>{
		let runtimeHosts:Hosts = await this.client.getAllInstances(instanceProperties.serviceName,
			instanceProperties.groupName,instanceProperties.clusters,instanceProperties.subscribe);
		this.logger.debug(
			'serviceName:%s, groupName:%s, Current available hosts length:%s',
			instanceProperties.serviceName,instanceProperties.groupName,runtimeHosts.length);

		let availableAddress:string;
		if(runtimeHosts.length>0){
			let hosts:WeightValue<Host>[] = this.addAddress(runtimeHosts);
			if(hosts.length>0){
				if(!this.loadBalanceMapping.get(instanceProperties.serviceName)){
					let roundRobinLoadBalancer:RoundRobinLoadBalancer<Host> = new RoundRobinLoadBalancer(hosts,false);
					this.loadBalanceMapping.set(instanceProperties.serviceName,roundRobinLoadBalancer);
					this.logger.debug('There, the serviceName[%s], create a new roundRobinLoadBalancer in memory. ',instanceProperties.serviceName);
				}
				let roundRobinLoadBalancer:RoundRobinLoadBalancer<Host> | undefined = this.loadBalanceMapping.get(instanceProperties.serviceName);
				if(roundRobinLoadBalancer){
					let host:WeightValue<Host> = roundRobinLoadBalancer.pick();
					availableAddress = host.value.custom.split('~')[0];
				}
			}else{
				this.loadBalanceMapping.delete(instanceProperties.serviceName);
				this.logger.debug('There are no available hosts, the serviceName[%s], delete roundRobinLoadBalancer in memory. ',instanceProperties.serviceName);
			}
		}
		this.logger.debug('Auto loadBalance picking an available host is %s',availableAddress);
		return availableAddress;
	}

	public async subscribeInstance(serviceName: string, groupName?: string,clusters?: string){
		this.client.subscribe({serviceName:serviceName,groupName:groupName,clusters:clusters},hosts => {
			this.logger.debug('Receive a new service tip from nacos ',hosts);
			let healthyHosts:WeightValue<Host>[] = this.addAddress(hosts);
			if(healthyHosts.length>0){
				let serviceName:string = healthyHosts[0].value.serviceName.split('@@')[1];
				let existedLoadBalance:RoundRobinLoadBalancer<Host>|undefined;
				if((existedLoadBalance = this.loadBalanceMapping.get(serviceName))){

					if(existedLoadBalance.poolSize() != healthyHosts.length){
						let roundRobinLoadBalancer:RoundRobinLoadBalancer<Host> = new RoundRobinLoadBalancer(healthyHosts,false);
						this.loadBalanceMapping.set(serviceName,roundRobinLoadBalancer);
						this.logger.debug('There, the serviceName[%s], existed size:%s, receive size:%s, create a new roundRobinLoadBalancer in memory. ',serviceName,existedLoadBalance.poolSize(),healthyHosts.length);
					}else {
						let add: boolean = false;
						let olds:WeightValue<Host>[] = existedLoadBalance.existedPool();
						let existInstanceIds:string[] = olds.map<string>((weightValue)=>{
							return weightValue.value.instanceId;
						});
						this.logger.debug('The serviceName[%s], existed size:%s, and nacos instanceId: %s', serviceName,olds.length,existInstanceIds);

						for (let healthyHost of healthyHosts) {
							if (!existInstanceIds.includes(healthyHost.value.instanceId, 0)) {
								add=true;
								break;
							}
						}

						if (add) {
							let roundRobinLoadBalancer:RoundRobinLoadBalancer<Host> = new RoundRobinLoadBalancer(healthyHosts,false);
							this.loadBalanceMapping.set(serviceName, roundRobinLoadBalancer);
							this.logger.debug('There, the serviceName[%s], equal quantity, and create a new roundRobinLoadBalancer in memory. ',serviceName);
						}
					}

				}else{
					let roundRobinLoadBalancer:RoundRobinLoadBalancer<Host> = new RoundRobinLoadBalancer(healthyHosts,false);
					this.loadBalanceMapping.set(serviceName,roundRobinLoadBalancer);
					this.logger.debug('There, add directly, the serviceName[%s], create a new roundRobinLoadBalancer in memory. ',serviceName);
				}
			}
		});
	}

	private addAddress(runtimeHosts:Object[]):WeightValue<Host>[]{
		let healthyHosts:WeightValue<Host>[]=[];

		runtimeHosts.forEach((host:Host,index:number)=>{
			this.logger.debug('Index:%s, host -> %s',index,host);
			if(host.healthy){
				host.custom = `http://${host.ip}:${host.port}~${host.instanceId}`;
				healthyHosts.push({value:host});
			}
		});

		this.logger.debug('healthyHosts -> ',healthyHosts);
		return healthyHosts;
	}

	async destroy (): Promise<void> {
		let client:any = this.client;
		//from the nacos-naming/lib/naming/client.js
		await client._close();
		this.logger.info('NacosDiscovery has closed successfully');
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