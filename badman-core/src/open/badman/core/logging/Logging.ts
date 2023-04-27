

import log4js, {Configuration, Log4js, Logger} from "log4js";
import Initializing from "../Initializing";


/**
 * 日志组件
 */
export default class Logging implements Initializing{


    private log4jsInstance:Log4js;

    private readonly customLog4jOptions: Configuration & string;

    private readonly defaultConfiguration:Configuration = {
        "appenders": {
            "stdout_appender": {
                "type": "stdout",
                "layout": { "type": "pattern","pattern":"%[[CDPID(%z)]-[%d{yyyy-MM-dd hh:mm:ss.SSS} %c-%p] [%f{1}<%A>.%M(%l)] %] <=> %m %n" }
            }
        },
        "categories": {
            "default": {
                "appenders": ["stdout_appender"],
                "level": "info",
                "enableCallStack": true
            }
        }
    };

    constructor(customLog4jOptions?: Configuration & string) {
        this.customLog4jOptions = customLog4jOptions;
    }

    afterInitialized() {
        if(!this.log4jsInstance){
            if(this.customLog4jOptions){
                this.log4jsInstance = log4js.configure(this.customLog4jOptions);
            }else {
                this.log4jsInstance = log4js.configure(this.defaultConfiguration);
            }
            this.log4js().getLogger().info(` Log4js configuration state is ${this.log4jsInstance.isConfigured()}`);
        }
    }

    log4js():Log4js{
        return this.log4jsInstance;
    }

    logger(category?: string):Logger{
        return this.log4js().getLogger(category);
    }
}