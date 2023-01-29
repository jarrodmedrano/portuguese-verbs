"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verbecc = void 0;
const zod_1 = require("zod");
const app_router_1 = require("../app/app.router");
const verbecc_controller_1 = require("./verbecc.controller");
const server_1 = __importDefault(require("@trpc/server"));
exports.verbecc = app_router_1.createRouter().query('get', {
    input: zod_1.z.object({
        verb: zod_1.z.string(),
        mood: zod_1.z.string().optional(),
    }),
    async resolve({ input }) {
        if (!input) {
            throw new server_1.default.TRPCError({
                code: 'BAD_REQUEST',
                message: `please supply a verb and mood`,
            });
        }
        return verbecc_controller_1.getConjugation(input);
    },
});
//# sourceMappingURL=verbecc.router.js.map