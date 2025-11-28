import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:3000/todos'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // READ - Fetch all todos on mount
  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Failed to fetch todos')
      const data = await response.json()
      setTodos(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // CREATE - Add new todo
  const handleAddTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo })
      })
      if (!response.ok) throw new Error('Failed to add todo')
      const data = await response.json()
      setTodos([...todos, data])
      setNewTodo('')
    } catch (err) {
      setError(err.message)
    }
  }

  // UPDATE - Toggle completed status
  const handleToggleComplete = async (todo) => {
    try {
      const response = await fetch(`${API_URL}/${todo._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...todo, completed: !todo.completed })
      })
      if (!response.ok) throw new Error('Failed to update todo')
      const updatedTodo = await response.json()
      setTodos(todos.map(t => t._id === updatedTodo._id ? updatedTodo : t))
    } catch (err) {
      setError(err.message)
    }
  }

  // UPDATE - Edit todo title
  const handleEditTodo = async (id) => {
    if (!editText.trim()) return

    try {
      const todo = todos.find(t => t._id === id)
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...todo, title: editText })
      })
      if (!response.ok) throw new Error('Failed to update todo')
      const updatedTodo = await response.json()
      setTodos(todos.map(t => t._id === updatedTodo._id ? updatedTodo : t))
      setEditingId(null)
      setEditText('')
    } catch (err) {
      setError(err.message)
    }
  }

  // DELETE - Remove todo
  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete todo')
      setTodos(todos.filter(t => t._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const startEditing = (todo) => {
    setEditingId(todo._id)
    setEditText(todo.title)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditText('')
  }

  if (loading) {
    return (
      <div className="app">
        <div className="container">
          <div className="loading">Loading todos...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>📝 Todo List</h1>
          <p className="subtitle">Stay organized, get things done</p>
        </header>

        {error && (
          <div className="error">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <form onSubmit={handleAddTodo} className="add-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            className="add-input"
          />
          <button type="submit" className="add-btn">Add</button>
        </form>

        <div className="todo-list">
          {todos.length === 0 ? (
            <div className="empty-state">
              <span>🎉</span>
              <p>No todos yet! Add one above.</p>
            </div>
          ) : (
            todos.map(todo => (
              <div key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                {editingId === todo._id ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="edit-input"
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button onClick={() => handleEditTodo(todo._id)} className="save-btn">Save</button>
                      <button onClick={cancelEditing} className="cancel-btn">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="todo-content" onClick={() => handleToggleComplete(todo)}>
                      <span className={`checkbox ${todo.completed ? 'checked' : ''}`}>
                        {todo.completed && '✓'}
                      </span>
                      <span className="todo-title">{todo.title}</span>
                    </div>
                    <div className="todo-actions">
                      <button onClick={() => startEditing(todo)} className="edit-btn">✏️</button>
                      <button onClick={() => handleDeleteTodo(todo._id)} className="delete-btn">🗑️</button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {todos.length > 0 && (
          <div className="stats">
            <span>{todos.filter(t => !t.completed).length} remaining</span>
            <span>{todos.filter(t => t.completed).length} completed</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default App