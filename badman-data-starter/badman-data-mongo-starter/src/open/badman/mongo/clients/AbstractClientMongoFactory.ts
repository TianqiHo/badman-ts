

import {Logger} from "log4js";
import MultiMongoProperties from "../MultiMongoProperties";


export default abstract class AbstractClientMongoFactory{

    protected logger:Logger;

    protected multiMongoProperties:MultiMongoProperties;

    protected constructor(multiMongoProperties:MultiMongoProperties,logger:Logger) {
        this.logger = logger;
        this.multiMongoProperties = multiMongoProperties;

    }

    getLogger():Logger{
        return this.logger;
    }
}