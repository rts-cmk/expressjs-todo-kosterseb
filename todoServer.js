import express from 'express';
import mongoose from 'mongoose';

const app = express();
const PORT = 3000;

// Built-in middleware to parse JSON (no need for body-parser in Express 5)
app.use(express.json());

// MongoDB connection string - replace with your actual credentials
const DB_URI = 'mongodb+srv://<db_username>:<db_password>@koestercluster.rqhqqyv.mongodb.net/todoApp';


// MONGOOSE SCHEMA & MODEL

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Todo = mongoose.model('Todo', todoSchema);

// ============================================
// CRUD ROUTES
// ============================================

// CREATE - Add a new todo
app.post('/todos', async (req, res) => {
  try {
    const todo = new Todo({
      title: req.body.title,
      completed: req.body.completed || false
    });
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ - Get all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get a single todo by ID
app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Update a todo by ID
app.put('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        completed: req.body.completed
      },
      { new: true, runValidators: true } // Return updated doc & run schema validation
    );
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Delete a todo by ID
app.delete('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully', todo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// DATABASE CONNECTION & SERVER START

mongoose.connect(DB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });