"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Verbs = void 0;
const app_router_1 = require("../app/app.router");
const verb_controller_1 = require("./verb.controller");
exports.Verbs = app_router_1.createRouter().query('get', {
    resolve: verb_controller_1.getVerbs,
});
//# sourceMappingURL=verb.router.js.map