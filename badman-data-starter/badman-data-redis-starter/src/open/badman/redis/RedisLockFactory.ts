

import RedisLock from "./RedisLock";

export default interface RedisLockFactory {
	getRedLock():RedisLock;
}