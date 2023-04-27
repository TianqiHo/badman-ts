

export default interface HttpClientResponse{


	close();

	body<ResponseBody>():ResponseBody;

	status():number;

	success():boolean;

	message():string;
}