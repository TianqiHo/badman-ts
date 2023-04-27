


import Initializing from "./open/badman/core/Initializing";
import RoundRobinLoadBalancer from "./open/badman/core/loadbalance/RoundRobinLoadBalancer";
import WeightValue from "./open/badman/core/loadbalance/WeightValue";
import AbstractLoadBalancer from "./open/badman/core/loadbalance/AbstractLoadBalancer";
import WeightedRoundRobinLoadBalancer from "./open/badman/core/loadbalance/WeightedRoundRobinLoadBalancer";
import Logging from "./open/badman/core/logging/Logging";
import NetParser from "./open/badman/core/net/NetParser";
import SingletonObjectFactory from "./open/badman/core/SingletonObjectFactory";
import SingletonObjectFactory2 from "./open/badman/core/SingletonObjectFactory2";
import Order from "./open/badman/core/Order";
import InstantiationAwarePostProcessor from "./open/badman/core/InstantiationAwarePostProcessor";
import Disposable from "./open/badman/core/Disposable";
import EventListener from "./open/badman/core/event/EventListener";
import EventListenerContext from "./open/badman/core/event/EventListenerContext";
import EventObject from "./open/badman/core/event/EventObject";

class BadmanCore {
    async main(this:BadmanCore){
        await SingletonObjectFactory2.initWithArgs<Logging>(Logging,['default_log4js_properties.json']);
        let logging:Logging = SingletonObjectFactory2.Instance(Logging.name);
        logging.log4js().getLogger('cccccccccccccc').info('-----------------');
    }
}

// (()=>{
//     new BadmanCore().main();
// })()

export {
    Logging,
    SingletonObjectFactory,
    SingletonObjectFactory2,
    Initializing,
    NetParser,
    RoundRobinLoadBalancer,
    WeightValue,
    AbstractLoadBalancer,
    WeightedRoundRobinLoadBalancer,
    Order,
    InstantiationAwarePostProcessor,
    Disposable,
    EventListener,
    EventListenerContext,
    EventObject
};




