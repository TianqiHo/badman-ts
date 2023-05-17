


import Initializing from "../../Initializing";
import SnowflakeProperties from "./SnowflakeProperties";


export default class Snowflake implements Initializing{

    /**
     * 雪花计算方法，（1-漂移算法|2-传统算法），默认 1
     */
    private method;

    /**
     * 基础时间（ms 单位），不能超过当前系统时间
     */
    private baseTime;

    /**
     * 机器码，必须由外部设定，最大值 2^WorkerIdBitLength-1
     */
    private workerId;

    /**
     * 机器码位长，默认值 6，取值范围 [1, 15](要求：序列数位长+机器码位长不超过 22)
     */
    private workerIdBitLength;

    /**
     * 序列数位长，默认值 6，取值范围 [3, 21](要求：序列数位长+机器码位长不超过 22)
     */
    private seqBitLength;

    /**
     * 最大序列数（含），设置范围 [MinSeqNumber, 2^SeqBitLength-1]，默认值 0，表示最大序列数取最大值（2^SeqBitLength-1]）
     */
    private maxSeqNumber;

    /**
     * 最小序列数（含），默认值 5，取值范围 [5, MaxSeqNumber]，每毫秒的前 5 个序列数对应编号 0-4 是保留位，其中 1-4 是时间回拨相应预留位，0 是手工新值预留位
     */
    private minSeqNumber;

    /**
     * 最大漂移次数（含），默认 2000，推荐范围 500-10000（与计算能力有关）
     */
    private topOverCostCount;

    /**
     *
     */
    private timestampShift;

    /**
     *
     */
    private currentSeqNumber;

    /**
     *
     */
    private lastTimeTick: bigint;

    /**
     * 回拨次序, 支持 4 次回拨次序（避免回拨重叠导致 ID 重复）
     */
    private turnBackTimeTick: bigint;

    /**
     *
     */
    private turnBackIndex;

    /**
     *
     */
    private isOverCost;

    /**
     *
     */
    private overCostCountInOneTerm;

    private snowflakeProperties:SnowflakeProperties;

    /**
     * @param {{
     *     baseTime: 1577836800000,  // 基础时间（ms 单位），默认2020年1月1日，不能超过当前系统时间，一旦投入使用就不能再更改，更改后产生的ID可能会和以前的重复
     *     WorkerId: Number, // 机器码，必须由外部设定，最大值 2^WorkerIdBitLength-1
     *     WorkerIdBitLength: 6,   // 机器码位长，默认值 6，取值范围 [1, 15](要求：序列数位长+机器码位长不超过 22)
     *     SeqBitLength: 6,   // 序列数位长，默认值 6，取值范围 [3, 21](要求：序列数位长+机器码位长不超过 22)
     *     MaxSeqNumber: 5, // 最大序列数（含），设置范围 [MinSeqNumber, 2^SeqBitLength-1]，默认值 0，表示最大序列数取最大值（2^SeqBitLength-1]）
     *     MinSeqNumber: 5, // 最小序列数（含），默认值 5，取值范围 [5, MaxSeqNumber]，每毫秒的前 5 个序列数对应编号 0-4 是保留位，其中 1-4 是时间回拨相应预留位，0 是手工新值预留位
     *     TopOverCostCount: 2000// 最大漂移次数（含），默认 2000，推荐范围 500-10000（与计算能力有关）
     * }} options
     */
    constructor(options: SnowflakeProperties) {

        if (options.workerId === undefined)
            throw new Error("lost WorkerId")

        this.snowflakeProperties = options;
    }

    async afterInitialized (): Promise<void> {

        // 1.baseTime 2020年1月1日 Wed, 01 Jan 2020 00:00:00 GMT 0时区的2020年1月1日
        const BaseTime = 1577836800000
        if (!this.snowflakeProperties.baseTime || this.snowflakeProperties.baseTime < 0)
            this.snowflakeProperties.baseTime = BaseTime

        // 2.WorkerIdBitLength
        const WorkerIdBitLength = 6
        if (!this.snowflakeProperties.workerIdBitLength || this.snowflakeProperties.workerIdBitLength < 0)
            this.snowflakeProperties.workerIdBitLength = WorkerIdBitLength

        // 4.SeqBitLength
        const seqBitLength = 6
        if (!this.snowflakeProperties.seqBitLength || this.snowflakeProperties.seqBitLength < 0)
            this.snowflakeProperties.seqBitLength = seqBitLength

        // 5.MaxSeqNumber
        if (this.snowflakeProperties.maxSeqNumber == undefined || this.snowflakeProperties.maxSeqNumber <= 0)
            this.snowflakeProperties.maxSeqNumber = (1 << this.snowflakeProperties.seqBitLength) - 1

        // 6.MinSeqNumber
        const MinSeqNumber = 5
        if (this.snowflakeProperties.minSeqNumber == undefined || this.snowflakeProperties.minSeqNumber < 0)
            this.snowflakeProperties.minSeqNumber = MinSeqNumber

        // 7.Others
        const topOverCostCount = 2000
        if (this.snowflakeProperties.topOverCostCount == undefined || this.snowflakeProperties.topOverCostCount < 0)
            this.snowflakeProperties.topOverCostCount = topOverCostCount


        if (this.snowflakeProperties.method !== 2)
            this.snowflakeProperties.method = 1
        else
            this.snowflakeProperties.method = 2

        this.method = BigInt(this.snowflakeProperties.method)
        this.baseTime = BigInt(this.snowflakeProperties.baseTime)
        this.workerId = BigInt(this.snowflakeProperties.workerId)
        this.workerIdBitLength = BigInt(this.snowflakeProperties.workerIdBitLength)
        this.seqBitLength = BigInt(this.snowflakeProperties.seqBitLength)
        this.maxSeqNumber = BigInt(this.snowflakeProperties.maxSeqNumber)
        this.minSeqNumber = BigInt(this.snowflakeProperties.minSeqNumber)
        this.topOverCostCount = BigInt(this.snowflakeProperties.topOverCostCount)

        const timestampShift = this.workerIdBitLength + this.seqBitLength
        const currentSeqNumber = this.minSeqNumber

        this.timestampShift = timestampShift
        this.currentSeqNumber = currentSeqNumber

        this.lastTimeTick = BigInt(0)
        this.turnBackTimeTick = BigInt(0)
        this.turnBackIndex = 0
        this.isOverCost = false
        this.overCostCountInOneTerm = 0

    }


    /**
     * 当前序列号超过最大范围，开始透支使用序号号的通知事件，，本项暂未实现
     * @returns
     */
    private BeginOverCostAction(useTimeTick: any) {

    }

    /**
     * 当前序列号超过最大范围，结束透支使用序号号的通知事件，，本项暂未实现
     * @returns
     */
    private EndOverCostAction(useTimeTick: any) {
        // if m1._TermIndex > 10000 {
        //     m1._TermIndex = 0
        // }
    }

    /**
     * 开始时间回拨通知，本项暂未实现
     * @returns
     */
    private BeginTurnBackAction(useTimeTick: any) {

    }

    /**
     * 结束时间回拨通知，本项暂未实现
     * @returns
     */
    private EndTurnBackAction(useTimeTick: any) {

    }

    /**
     * 雪花漂移算法
     * @returns
     */
    private NextOverCostId(): bigint {
        const currentTimeTick = this.GetCurrentTimeTick()
        if (currentTimeTick > this.lastTimeTick) {
            this.EndOverCostAction(currentTimeTick)
            //当前时间大于上次时间，说明是时间是递增的，这是正常情况
            this.lastTimeTick = currentTimeTick
            this.currentSeqNumber = this.minSeqNumber
            this.isOverCost = false
            this.overCostCountInOneTerm = 0
            // this._GenCountInOneTerm = 0
            return this.CalcId(this.lastTimeTick)
        }
        if (this.overCostCountInOneTerm >= this.topOverCostCount) {
            //当前漂移次数超过最大限制

            // TODO: 在漂移终止，等待时间对齐时，如果发生时间回拨较长，则此处可能等待较长时间。可优化为：在漂移终止时增加时间回拨应对逻辑。（该情况发生概率很低）

            this.EndOverCostAction(currentTimeTick)
            this.lastTimeTick = this.GetNextTimeTick()
            this.currentSeqNumber = this.minSeqNumber
            this.isOverCost = false
            this.overCostCountInOneTerm = 0
            // this._GenCountInOneTerm = 0
            return this.CalcId(this.lastTimeTick)
        }
        if (this.currentSeqNumber > this.maxSeqNumber) {
            //当前序列数超过最大限制，则要提前透支
            this.lastTimeTick++
            this.currentSeqNumber = this.minSeqNumber
            this.isOverCost = true
            this.overCostCountInOneTerm++
            // this._GenCountInOneTerm++

            return this.CalcId(this.lastTimeTick)
        }

        // this._GenCountInOneTerm++
        return this.CalcId(this.lastTimeTick)
    }

    /**
     * 常规雪花算法
     * @returns
     */
    private NextNormalId() {
        const currentTimeTick = this.GetCurrentTimeTick()
        if (currentTimeTick < this.lastTimeTick) {
            if (this.turnBackTimeTick < 1) {
                this.turnBackTimeTick = this.lastTimeTick - BigInt(1)
                this.turnBackIndex++
                // 每毫秒序列数的前 5 位是预留位，0 用于手工新值，1-4 是时间回拨次序
                // 支持 4 次回拨次序（避免回拨重叠导致 ID 重复），可无限次回拨（次序循环使用）。
                if (this.turnBackIndex > 4)
                    this.turnBackIndex = 1
                this.BeginTurnBackAction(this.turnBackTimeTick)
            }

            return this.CalcTurnBackId(this.turnBackTimeTick)
        }

        // 时间追平时，_TurnBackTimeTick 清零
        if (this.turnBackTimeTick > 0) {
            this.EndTurnBackAction(this.turnBackTimeTick)
            this.turnBackTimeTick = BigInt(0)
        }

        if (currentTimeTick > this.lastTimeTick) {
            this.lastTimeTick = currentTimeTick
            this.currentSeqNumber = this.minSeqNumber
            return this.CalcId(this.lastTimeTick)
        }

        if (this.currentSeqNumber > this.maxSeqNumber) {
            this.BeginOverCostAction(currentTimeTick)
            // this._TermIndex++
            this.lastTimeTick++
            this.currentSeqNumber = this.minSeqNumber
            this.isOverCost = true
            this.overCostCountInOneTerm = 1
            // this._GenCountInOneTerm = 1

            return this.CalcId(this.lastTimeTick)
        }

        return this.CalcId(this.lastTimeTick)
    }

    /**
     * 生成ID
     * @param useTimeTick 时间戳
     * @returns
     */
    private CalcId(useTimeTick: bigint) {
        //ID组成 1.相对基础时间的时间差 | 2.WorkerId | 3.序列数
        //时间差，是生成ID时的系统时间减去 BaseTime 的总时间差（毫秒单位）
        const result = BigInt(useTimeTick << this.timestampShift) + BigInt(this.workerId << this.seqBitLength) + BigInt(this.currentSeqNumber)
        this.currentSeqNumber++
        return result
    }

    /**
     * 生成时间回拨ID
     * @returns
     */
    private CalcTurnBackId(useTimeTick: any) {
        const result = BigInt(useTimeTick << this.timestampShift) + BigInt(this.workerId << this.seqBitLength) + BigInt(this.turnBackIndex)
        this.turnBackTimeTick--
        return result
    }

    /**
     *
     * @returns
     */
    private GetCurrentTimeTick() {
        const millis = BigInt((new Date()).valueOf())
        return millis - this.baseTime
    }

    /**
     *
     * @returns
     */
    private GetNextTimeTick() {
        let tempTimeTicker = this.GetCurrentTimeTick()
        while (tempTimeTicker <= this.lastTimeTick) {
            tempTimeTicker = this.GetCurrentTimeTick()
        }
        return tempTimeTicker
    }

    private maxId = BigInt(9007199254740992);
    /**
     * 生成ID
     * @returns 始终输出number类型，超过时throw error
     */
    public NextNumber(): number {
        if (this.isOverCost) {
            //
            let id = this.NextOverCostId()
            if (id >= this.maxId)
                throw Error(`${id.toString()} over max of Number 9007199254740992`)

            return parseInt(id.toString())
        } else {
            //
            let id = this.NextNormalId()
            if (id >= this.maxId)
                throw Error(`${id.toString()} over max of Number 9007199254740992`)

            return parseInt(id.toString())
        }
    }

    /**
     * 生成ID
     * @returns 根据输出数值判断，小于number最大值时输出number类型，大于时输出bigint
     */
    public NextId(): number | bigint {
        if (this.isOverCost) {
            //
            let id = this.NextOverCostId()
            if (id >= this.maxId)
                return id
            else
                return parseInt(id.toString())
        } else {
            //
            let id = this.NextNormalId()
            if (id >= this.maxId)
                return id
            else
                return parseInt(id.toString())
        }
    }

    /**
     * 生成ID
     * @returns 始终输出bigint类型
     */
    public NextBigId(): bigint {
        if (this.isOverCost) {
            //
            return this.NextOverCostId()
        } else {
            //
            return this.NextNormalId()
        }
    }
}

