



export default class RestRequestParam<T> {

	/**
	 * 服务名称
	 */
	serviceName:string;

	/**
	 * 服务名是否用于接口路径
	 */
	serviceNameForPath:boolean;

	/**
	 * 命名空间
	 */
	namespace?:string='/';

	/**
	 * 接口URI
	 */
	uri:string;

	/**
	 * 请求类型
	 */
	method:string;

	/**
	 * 服务分组名称
	 */
	groupName?:string;

	/**
	 * 参数体
	 */
	param ?:T;

	header?:Map<string,string | string[] | number | boolean>;

}