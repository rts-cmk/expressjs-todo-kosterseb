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
