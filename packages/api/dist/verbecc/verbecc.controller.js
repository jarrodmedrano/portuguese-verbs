"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConjugation = void 0;
const axios_1 = __importDefault(require("axios"));
const getConjugation = async ({ verb, mood }) => {
    const response = await axios_1.default.get(`${process.env.VERBECC_API}/conjugate/pt/${verb}?mood=${mood}`);
    const data = response.data;
    return data;
};
exports.getConjugation = getConjugation;
//# sourceMappingURL=verbecc.controller.js.map