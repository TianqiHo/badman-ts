"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const badman_core_1 = require("badman-core");
const nacos_naming_1 = require("nacos-naming");
class NacosDiscovery {
    constructor(autoRegistrySelf, serverProperties) {
        this.localServerAddr = 'localhost:8848';
        this.defaultNamespace = 'default';
        this.defaultUsername = 'nacos';
        this.defaultPassword = 'nacos';
        if (autoRegistrySelf) {
            this.autoRegistrySelf = autoRegistrySelf;
        }
        else {
            this.autoRegistrySelf = true;
        }
        this.serverProperties = serverProperties;
        this.loadBalanceMapping = new Map();
        if (this.serverProperties && this.serverProperties.serverList && this.serverProperties.namespace) {
            this.client = new nacos_naming_1.NacosNamingClient(this.serverProperties);
        }
        else {
            let logger = console;
            let address = this.localServerAddr;
            let namespace = this.defaultNamespace;
            let serverProperties = { logger: logger, serverList: address, namespace: namespace };
            this.client = new nacos_naming_1.NacosNamingClient(serverProperties);
        }
    }
    afterInitialized() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.ready();
            if (this.autoRegistrySelf) {
                let ipv4 = new badman_core_1.NetParser().parseIPV4Address();
                yield this.registerInstance({ serviceName: (+Date.now()).toString(), instance: { ip: ipv4, port: 0 } });
            }
        });
    }
    registerInstance(instanceProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            yield this.client.registerInstance(instanceProperties.serviceName, instanceProperties.instance, instanceProperties.groupName);
        });
    }
    obtainInstance(instanceProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            let runtimeHosts = yield this.client.getAllInstances(instanceProperties.serviceName, instanceProperties.groupName, instanceProperties.clusters, instanceProperties.subscribe);
            if (runtimeHosts.length > 0) {
                let hosts = this.addAddress(runtimeHosts);
                if (hosts.length > 0) {
                    if (!this.loadBalanceMapping.get(instanceProperties.serviceName)) {
                        //let roundRobinLoadBalancer:RoundRobinLoadBalancer<any, any> = new RoundRobinLoadBalancer(hosts,false);
                        //this.loadBalanceMapping.set(instanceProperties.serviceName,roundRobinLoadBalancer);
                    }
                    //let roundRobinLoadBalancer:RoundRobinLoadBalancer<Host,HostPool> = this.loadBalanceMapping.get(instanceProperties.serviceName);
                    //let index:number = roundRobinLoadBalancer.pick();
                    //let host:string = hosts[index];
                    //return host.split('~')[0];
                }
                else {
                    this.loadBalanceMapping.delete(instanceProperties.serviceName);
                }
            }
            return null;
        });
    }
    subscribeInstance(serviceName, groupName, clusters) {
        return __awaiter(this, void 0, void 0, function* () {
            // this.client.subscribe({serviceName:serviceName,groupName:groupName,clusters:clusters},hosts=>{
            // 	let healthyHosts:Hosts = this.addAddress(hosts);
            // 	if(healthyHosts.length>0){
            // 		let serviceName:string = healthyHosts[0]['serviceName'].split('@@')[1];
            // 		let existedLoadBalance:P2cBalancer;
            // 		if((existedLoadBalance = this.loadBalanceMapping.get(serviceName))){
            //
            // 			if(existedLoadBalance._poolSize != healthyHosts.length){
            // 				this.loadBalanceMapping.set(serviceName,LoadBalance.roundRobin(healthyHosts));
            // 			}else {
            // 				let add: boolean = false;
            // 				let olds:string[] = existedLoadBalance._pool;
            // 				for (let healthyHost of healthyHosts) {
            // 					let val: string = `${healthyHost['ip']}:${healthyHost['port']}~${healthyHost['instanceId']}`;
            // 					if (!olds.includes(val, 0)) {
            // 						add=true;
            // 						break;
            // 					}
            // 				}
            // 				if (add) {
            // 					this.loadBalanceMapping.set(serviceName, LoadBalance.roundRobin(healthyHosts));
            // 				}
            // 			}
            //
            // 		}else{
            // 			this.loadBalanceMapping.set(serviceName,LoadBalance.roundRobin(healthyHosts));
            // 		}
            // 	}
            // });
        });
    }
    addAddress(runtimeHosts) {
        let healthyHosts = [];
        for (let host of runtimeHosts) {
            if (host.healthy) {
                host.value = `http://${host.ip}:${host.port}~${host.instanceId}`;
                healthyHosts.push(host);
            }
        }
        return healthyHosts;
    }
}
exports.default = NacosDiscovery;
