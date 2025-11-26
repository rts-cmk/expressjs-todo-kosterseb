import express from 'express';
import bodyParser from 'body-parser';


const app = express();
const PORT = 3000;
app.use(bodyParser.json());

let todos = [];
app.get('/todos', (req, res) => {
    res.json(todos);
    }
);
app.post('/todos', (req, res) => {
    const todo = req.body;
    todos.push(todo);
    res.status(201).json(todo);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}
);

