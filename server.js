//using express
const express = require("express");
//using mongoose
const mongoose = require('mongoose');
//using CORS
const cors = require("cors");

//create an instance of express
const app = express();
app.use(express.json());
app.use(cors());

//Sample in-memory storage for todo items
//const todos = [];

//mongoDb connection
mongoose.connect('mongodb://localhost:27017/todo-app')
    .then(() => {
        console.log('Database connected.');
    })
    .catch((err) => {
        console.log(err);
    });

//creating scheme
const todoScheme = new mongoose.Schema({
    title: {
        required: true,
        type: String,
    },
    description: String,

});

//creating model
const todoModel = new mongoose.model('Todo', todoScheme);

//create a new todo item
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    //const newTodo = {
    //  id:todos.length+1,
    //  title,
    //  description
    //};
    //todos.push(newTodo);
    //console.log(todos);
    try {
        const newTodo = todoModel({ title, description });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }

});

//get all items
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }

});

//update a todo item
app.put('/todos/:id',async (req, res) => {
    try {
        const { title, description } = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title, description },
            {new:true}
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.json(updatedTodo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });

    }
})

//delete a todo item
app.delete('/todos/:id', async (req,res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})

//start the server
const port = 5000;
app.listen(port, () => {
    console.log("Server is listening to port " + port);
});