

import WeightValue from "./WeightValue";


export default abstract class AbstractLoadBalancer<Value> {


	protected isWeight:boolean;

	protected pool:WeightValue<Value>[];

	protected currentIndex:number;

	protected constructor (pool:WeightValue<Value>[],isWeight:boolean) {

		if(isWeight){
			this.isWeight = isWeight;
		}else{
			this.isWeight = false;
		}

		if(isWeight){
			this.prepareWeights(pool);
		}else{
			this.pool = pool;
		}
		this.currentIndex = 0;
	}

	/**
	 * pick a single member from the pool using the load balancing implementation
	 *
	 */
	abstract pick():WeightValue<Value>;

	poolSize():number{
		return this.pool.length;
	}

	existedPool():WeightValue<Value>[]{
		return this.pool;
	}

	protected prepareWeights(pool:WeightValue<Value>[]){
		if (pool.length === 0) {
			throw new Error('cannot prepare a zero length pool')
		}

		const preparedPool = [];

		pool.sort(function(a, b) {
			return b.weight - a.weight
		})

		pool.forEach(function (entry, index) {
			let v:Value;

			// check this in a way that allows the use of zeros and "false" as object
			if (entry.value !== undefined && entry.value !== null) {
				v = entry.value
			}

			if (v === undefined || v === null) {
				throw new Error('Please specify an object or a value (alias for object) property for entry in index ' + index)
			}

			if (entry.weight <= 0) {
				throw new Error('Weight in index ' + index + ' must be greater than zero')
			}

			if (entry.weight % 1 !== 0) {
				throw new Error('Weight in index ' + index + ' must be an integer')
			}

			for (let i = 0; i < entry.weight; i++) {
				preparedPool.push(v);
			}
		})

		return preparedPool;
	}
}