


export default interface InstantiationAwarePostProcessor {

    beforePostProcess();

    postProcess();

    afterPostProcess(instance:any);

}