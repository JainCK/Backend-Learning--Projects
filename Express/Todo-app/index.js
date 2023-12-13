const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

let tasks = [];

app.get('/tasks',(req,res) => {
    res.json(tasks);
});


app.post('/tasks',(req,res) => {
    const { task } = req.body;
    tasks.push(task);
    res.json({ message: 'Task Added', tasks });
});


app.put('tasks/:id', (req, res) => {
    const taskId =req.params.id;
    const { updatedTask } = req.body;
    tasks[taskId] = updatedTask;
    res.json({ message: 'Task Updated', tasks });
});


app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    tasks.splice(taskId, 1);
    res.json({ message: 'Task deleted', tasks });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});