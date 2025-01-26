const Todo = require("../modals/TodoModal");

exports.getAllTodos = async () => {
    try {
        const todos = await Todo.find({ completed: false });
        return todos;
    } catch (err) {
        throw new Error("Failed to fetch the todos");
    }
}

exports.getTodo = async (parent, args) => {
    try {
        const todo = await Todo.findById(args.id);
        return todo;
    } catch (err) {
        throw new Error("Failed to fetch a todo");
    }
}

exports.createTodo = async (parent, args) => {
    try {
        const todo = await Todo.create({ title: args.title });
        return todo;
    } catch (err) {
        throw new Error("Failed to create a todo");
    }
}

exports.editSingleTodo = async (parent, args) => {
    try {
        const todo = await Todo.findByIdAndUpdate(args.id, {
            title: args.title,
            completed: args.completed
        })
        return todo;
    } catch (err) {
        throw new Error("Failed to fetch update todo");
    }
}

exports.deleteSingleTodo = async (parent, args) => {
    try {
        const todo = await Todo.findByIdAndDelete(args.id);
        return todo;
    } catch (err) {
        throw new Error("Failed to fetch the todos");
    }
}