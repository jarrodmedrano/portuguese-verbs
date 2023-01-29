"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConjugations = exports.getVerbs = void 0;
const db_1 = __importDefault(require("../db"));
const getVerbs = async () => {
    return db_1.default.verb.findMany();
};
exports.getVerbs = getVerbs;
const getConjugations = async () => {
    return db_1.default.conjugations.findMany();
};
exports.getConjugations = getConjugations;
//# sourceMappingURL=verb.controller.js.map