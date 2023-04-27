


import AbstractLoadBalancer from "./AbstractLoadBalancer";
import WeightValue from "./WeightValue";


export default class RoundRobinLoadBalancer<Value> extends AbstractLoadBalancer<Value> {

	constructor (pool:WeightValue<Value>[],isWeight:boolean = false) {
		super(pool,isWeight);
	}

	pick() :WeightValue<Value>{
		let pick = this.pool[this.currentIndex++]
		this.currentIndex = this.currentIndex % this.pool.length;
		return pick;
	}
}