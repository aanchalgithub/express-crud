const Todo = require('../Models/ToDoModel');

exports.getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ date: -1 });
    res.status(200).json(todos);
    console.log(todos)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTodo = async (req, res) => {
    const todo = new Todo({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date
    });
  
    try {
      const newTodo = await todo.save();
      res.status(201).json(newTodo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  exports.updateTodo = async (req, res) => {
    const { id } = req.params;
  
    try {
      const todo = await Todo.findById(id);
      if (!todo) {
        return res.status(404).json({ message: 'ToDoList item not found' });
      }
  
 
      if (req.body.title !== undefined) {
        todo.title = req.body.title;
      }
      if (req.body.description !== undefined) {
        todo.description = req.body.description;
      }
      if (req.body.date !== undefined) {
        todo.date = req.body.date;
      }
  
      const updatedTodo = await todo.save();
      res.status(400).json(updatedTodo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  exports.deleteTodo = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedTodo = await Todo.findByIdAndDelete(id);
      if (!deletedTodo) {
        return res.status(404).json({ message: 'ToDoList item not found' });
      }
      res.json({ message: 'ToDoList item deleted successfully' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };