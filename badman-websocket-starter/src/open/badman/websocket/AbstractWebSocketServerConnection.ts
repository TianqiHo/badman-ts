


import * as console from "console";
import {WebSocket} from 'ws';
import RequestBodyEntity from "./RequestBodyEntity";
import WebSocketServerProperties from "./WebSocketServerProperties";

export default abstract class AbstractWebSocketServerConnection<Request extends RequestBodyEntity> {

    private wsClient: WebSocket;
    private readonly requestBody: Request;
    private isAlive: boolean = false;
    private readonly intervalPing: NodeJS.Timer;
    protected serverProperties:WebSocketServerProperties;


    protected constructor(serverProperties:WebSocketServerProperties,ws: WebSocket, requestBody: Request) {
        this.serverProperties = serverProperties;
        //既然客户端能连接到服务端,触发connection事件,就表示当前属性是true
        this.isAlive = true;
        this.wsClient = ws;
        this.requestBody = requestBody;
        this.wsClient.on('message', (msg:Buffer)=>{
            this.onMessage(msg);
        });
        this.wsClient.on('pong', ()=>{
            this.onPong();
        });
        this.wsClient.on('close', ()=>{
            this.onCloseTestConnection();
        });
        this.intervalPing = setInterval(()=>{
            if (this.isAlive === false) {
                //要不要主动关闭客户端?多此一举？
                this.wsClient.terminate(); //会自动出发close时间
                //this.closeTestConnection();
            }
            this.isAlive = false;
            this.wsClient.ping();
        }, this.serverProperties.heartBeatInterval);
    }

    abstract onMessage (msg:Buffer);

    protected sendMessage(message:string){
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
    }

    /**
     * 当前链接是否活动
     */
    get alive(): boolean {
        return this.isAlive;
    }

    get getRequestBody():RequestBodyEntity{
        return this.requestBody;
    }
}