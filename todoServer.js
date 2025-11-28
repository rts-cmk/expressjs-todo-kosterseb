import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();
const PORT = 3000;
app.use(bodyParser.json());

const DB_URI = 'mongodb+srv://<db_username>:<db_password>@koestercluster.rqhqqyv.mongodb.net/'

mongoose.connect(DB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    // Start the Express server ONLY after a successful database connection
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    // Log the error and exit the process if the connection fails
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

  // Middleware to parse JSON bodies

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

