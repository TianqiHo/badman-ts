


import WeightValue from "./WeightValue";
import RoundRobinLoadBalancer from "./RoundRobinLoadBalancer";


export default class WeightedRoundRobinLoadBalancer<V> extends RoundRobinLoadBalancer<V>{



	constructor (pool:WeightValue<V>[]) {
		super(pool,true);
	}
}