"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todos = void 0;
const zod_1 = require("zod");
const app_router_1 = require("../app/app.router");
const todo_controller_1 = require("./todo.controller");
exports.todos = app_router_1.createRouter()
    .query('get', {
    resolve: todo_controller_1.getTodos,
})
    .mutation('create', {
    input: zod_1.z.string().min(3),
    resolve: ({ input }) => todo_controller_1.createTodo(input),
})
    .mutation('delete', {
    input: zod_1.z.number(),
    resolve: ({ input }) => todo_controller_1.deleteTodo(input),
})
    .mutation('update', {
    input: zod_1.z.number(),
    resolve: ({ input }) => todo_controller_1.updateTodoStatus(input),
});
//# sourceMappingURL=todo.router.js.map