

export default class Base {


	public static sleep(seconds:number=0,cb?:any){
		new Promise<boolean>((resolve, reject) => {
			setTimeout(()=>{
				resolve(true);
			},seconds);
		}).then(val => {
			if (cb)cb(val);
		});
	}

	public static clone<S,T>(source:S, target:T) {
		let keys = Object.keys(source);
		let i = keys.length;
		while (i--) {
			let k = keys[i];
			target[k] = source[k];
		}
		return target;
	}

	public static getMethodArgs(func) {
		// 先用正则匹配,取得符合参数模式的字符串.
		// 第一个分组是这个:  ([^)]*) 非右括号的任意字符
		let args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];

		// 用逗号来分隔参数(arguments string).
		return args.split(",").map(function(arg) {
			// 去除注释(inline comments)以及空格
			return arg.replace(/\/\*.*\*\//, "").trim();
		}).filter(function(arg) {
			// 确保没有 undefined.
			return arg;
		});
	}

}