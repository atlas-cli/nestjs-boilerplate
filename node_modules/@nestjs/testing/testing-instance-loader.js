"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestingInstanceLoader = void 0;
const instance_loader_1 = require("@nestjs/core/injector/instance-loader");
const testing_injector_1 = require("./testing-injector");
class TestingInstanceLoader extends instance_loader_1.InstanceLoader {
    constructor() {
        super(...arguments);
        this.injector = new testing_injector_1.TestingInjector();
    }
    async createInstancesOfDependencies(modules = this.container.getModules(), mocker) {
        this.injector.setContainer(this.container);
        mocker && this.injector.setMocker(mocker);
        await super.createInstancesOfDependencies();
    }
}
exports.TestingInstanceLoader = TestingInstanceLoader;
