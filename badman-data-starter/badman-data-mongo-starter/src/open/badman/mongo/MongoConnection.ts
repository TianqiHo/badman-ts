

import MongoCommand from "./MongoCommand";


export default interface MongoConnection extends MongoCommand{

	close();

	isClosed():boolean;

	open():boolean;

}