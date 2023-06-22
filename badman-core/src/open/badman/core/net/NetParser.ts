

import * as net from "net";
import os, {NetworkInterfaceInfo} from "os";
import Initializing from "../Initializing";


export default class NetParser implements Initializing{
    constructor() {}

    async afterInitialized (): Promise<void> {}

    public parseIPV4Address():string{
        let networkInterfaces:NodeJS.Dict<NetworkInterfaceInfo[]> = os.networkInterfaces();

        for (let dev in networkInterfaces) {
            let networkInterface = networkInterfaces[dev];
            for (let i = 0; i < networkInterface.length; i++) {
                let { family, address, internal } = networkInterface[i];
                console.info(`当前网卡信息-> ${family} ${address} ${internal}`);
                if (net.isIPv4(address)) {
                    return address;
                }
            }
        }
        return null;
    }
}