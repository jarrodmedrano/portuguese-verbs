"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTodoStatus = exports.deleteTodo = exports.createTodo = exports.getTodos = void 0;
const db_1 = __importDefault(require("../db"));
const getTodos = async () => {
    return db_1.default.todo.findMany();
};
exports.getTodos = getTodos;
const createTodo = async (input) => {
    const todo = await db_1.default.todo.create({
        data: { item_text: input, status: false },
    });
    return todo;
};
exports.createTodo = createTodo;
const deleteTodo = async (id) => {
    await db_1.default.todo.delete({ where: { id } });
    return true;
};
exports.deleteTodo = deleteTodo;
const updateTodoStatus = async (id) => {
    let todo = await db_1.default.todo.findUnique({ where: { id } });
    if (!todo)
        return null;
    todo = await db_1.default.todo.update({
        where: { id },
        data: { status: !todo.status },
    });
    return todo;
};
exports.updateTodoStatus = updateTodoStatus;
//# sourceMappingURL=todo.controller.js.map