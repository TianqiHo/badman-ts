


export default interface RabbitConsumer<Channel,Message>{
	consume(channel:Channel,message:Message):Promise<void>;

}