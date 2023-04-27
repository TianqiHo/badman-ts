

/**
 *  事件驱动根接口
 */
export default abstract class EventObject<SourceType>{

    readonly source: SourceType;

    readonly timestamp:number;

    protected constructor(source: SourceType) {
        this.source = source;
        this.timestamp = +Date.now();
    }

    get getSource(): SourceType {
        return this.source;
    }

    get getTimestamp(): number{
        return  this.timestamp;
    }

}