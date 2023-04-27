"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const badman_core_1 = require("badman-core");
const NacosDiscovery_1 = __importDefault(require("./open/badman/discovery/nacos/NacosDiscovery"));
class BadmanNacosDiscovery {
    main() {
        return __awaiter(this, void 0, void 0, function* () {
            let serverProperties = {
                logger: console, namespace: "dev", serverList: ["47.92.159.142:8848"]
            };
            let nacosDiscovery = yield badman_core_1.SingletonObjectFactory2.initWithArgs(NacosDiscovery_1.default, [false, serverProperties]);
            let nacosInstanceProperties = {
                groupName: "dev",
                serviceName: "web_server",
                subscribe: false
            };
            yield nacosDiscovery.obtainInstance(nacosInstanceProperties);
        });
    }
}
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield (new BadmanNacosDiscovery()).main();
    });
})();
