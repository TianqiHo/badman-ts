

export default interface SentStatus{

	newsId: number;

	/**
	 * true 发送成功  false 失败
	 */
	state: boolean;

	sender: string;

	/**
	 * 发送失败原因
	 */
	errTip:string;

}