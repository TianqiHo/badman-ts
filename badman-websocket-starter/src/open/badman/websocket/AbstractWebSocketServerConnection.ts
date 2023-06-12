

import {Logger} from "log4js";
import {WebSocket} from 'ws';
import AbstractWebSocketServer from "./AbstractWebSocketServer";
import RequestBodyEntity from "./RequestBodyEntity";
import WebSocketServerProperties from "./WebSocketServerProperties";

export default abstract class AbstractWebSocketServerConnection<Request extends RequestBodyEntity> {

    protected wsClient: WebSocket;
    protected requestBody: Request;
    private isAlive: boolean = false;
    private intervalPing: NodeJS.Timer;
    protected serverProperties:WebSocketServerProperties;
    protected server:AbstractWebSocketServer<Request, AbstractWebSocketServerConnection<Request>>;
    protected logger:Logger;


    protected constructor(server:AbstractWebSocketServer<Request, any>,ws: WebSocket, requestBody: Request) {
        this.server = server;
        this.logger = this.server.getLogger();
        this.serverProperties = this.server.getServerProperties();

        //既然客户端能连接到服务端,触发connection事件,就表示当前属性是true
        this.isAlive = true;
        this.wsClient = ws;
        this.requestBody = requestBody;
        this.wsClient.on('message', (msg:Buffer)=>{
            this.onMessage(msg);
        });
        this.wsClient.on('pong', ()=>{
            this.onPong();
            if(this.isAlive){
                this.logger.debug(`心跳检测结果 clientId= ${this.getRequestBody.clientId} alive = ${this.isAlive}`);
            }else{
                this.logger.info(`心跳检测结果 clientId= ${this.getRequestBody.clientId} alive = ${this.isAlive}`);
            }
        });
        this.wsClient.on('close', ()=>{
            this.logger.info('当前连接已断开,收到关闭事件 clientId=',this.getRequestBody.clientId);
            this.onCloseTestConnection();
        });
        this.intervalPing = setInterval(()=>{
            if (this.isAlive === false) {
                //要不要主动关闭客户端?多此一举？
                this.logger.info('检测到当前连接已断开 clientId=',this.getRequestBody.clientId);
                this.wsClient.terminate(); //会自动出发close事件
                //this.closeTestConnection();
            }
            this.isAlive = false;
            this.wsClient.ping();
        }, this.serverProperties.heartBeatInterval);
    }

    abstract onMessage (msg:Buffer);


    sendMessage(message:string){
        this.wsClient.send(message);
    }

    protected onPong(){
        this.isAlive = true;
    }
    protected onCloseTestConnection() {

        //关闭实例状态
        this.isAlive=false;
        //删除定时心跳检测
        clearInterval(this.intervalPing);
        //todo 删除连接池中的当前引用
        this.server.forceDeleteConnection(this.requestBody.clientId);

    }

    close(){
        this.wsClient.terminate();
        this.isAlive=false;
        clearInterval(this.intervalPing);
        this.server = undefined;
        this.serverProperties = undefined;
        this.requestBody = undefined;
        this.intervalPing = undefined;
        this.logger = undefined;
    }

    /**
     * 当前链接是否活动
     */
    get alive(): boolean {
        return this.isAlive;
    }

    get getRequestBody():Request{
        return this.requestBody;
    }
}