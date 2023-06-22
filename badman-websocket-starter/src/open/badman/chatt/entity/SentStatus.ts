

export default interface SentStatus{

	roomId:string;

	newsId: string;

	/**
	 * true 发送成功  false 失败
	 */
	state: boolean;

	sender: string;

	/**
	 * 发送失败原因
	 */
	errTip:string;

	/**
	 * 服务器转发成功时间
	 */
	serverSendTime: Date;

}