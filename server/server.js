const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const connectToMongo = require("./config/db");
const dotenv = require("dotenv");
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLBoolean
} = require("graphql");
const {
    getAllTodos,
    getTodo,
    createTodo,
    editSingleTodo,
    deleteSingleTodo
} = require("./controllers/todoController");
const cors = require("cors");

const app = express();

// Config environment variables

if (process.env.NODE_ENV != "PRODUCTION") {
    dotenv.config({ path: "server/config/config.env" });
}

app.use(cors({
    origin: "*",
    credentials: true
}))

connectToMongo(); // Connecting to MongoDB Database

const TodoType = new GraphQLObjectType({
    name: "Todo",
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLNonNull(GraphQLString) },
        completed: { type: GraphQLNonNull(GraphQLBoolean) }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    fields: () => ({
        todo: {
            type: TodoType,
            args: { 
                id: { type: GraphQLNonNull(GraphQLString) }  
            },
            resolve: getTodo
        },
        todos: {
            type: new GraphQLList(TodoType),
            resolve: getAllTodos
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: "Mutations",
    fields: () => ({
        addTodo: {
            type: TodoType,
            args: {
                title: { type: GraphQLNonNull(GraphQLString) }
            }, 
            resolve: createTodo
        },
        editTodo: {
            type: TodoType,
            args: {
                id: { type: GraphQLNonNull(GraphQLString) },
                title: { type: GraphQLString },
                completed: { type: GraphQLBoolean }
            }, 
            resolve: editSingleTodo
        },
        deleteTodo: {
            type: TodoType,
            args: {
                id: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: deleteSingleTodo
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true
}))

const PORT = process.env.PORT || 5173;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})