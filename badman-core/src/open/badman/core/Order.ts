
export default interface Order{

    //值越大权重越小越靠后执行
    getOrder():number;
}