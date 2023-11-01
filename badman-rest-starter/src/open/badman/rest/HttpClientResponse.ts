

export default interface HttpClientResponse{


	close();

	body<ResponseBody>():ResponseBody;

	status():number;

	success():boolean;

	is2xxSuccessful():boolean;

	message():string;
}