require("dotenv").config();

const express = require('express');
const cors = require('cors');
const logRequest = require('./middlewares/logger.js');
const validateTodo = require('./middlewares/validator.js');
const validatePatch = require('./middlewares/validatepatch.js');
const errorHandler = require('./middlewares/errorHandler.js');
const app = express();



app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(logRequest); //Log requests


let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: true },
];





app.get('/todos', (req, res, next) => {
     res.send(todos)
});



// GET All – Read
app.get('/todos/:id', (req, res, next) => {
   try { 
     const id = req.params.id;
     const todo = todos.find((t) => t.id === parseInt(req.params.id));
        if (!todo) {
           return res.status(404).json(`Error: Todo ID ${id} not found`)};
     res.status(200).json(todo); // Send array as JSON
   } catch (error) {
   next(error);
     }
});




// POST New – Create
app.post('/todos', validateTodo, (req, res, next) => {
   try {
     const { task } = req.body;  
        if (!task || !task.trim()) {
           return res.status(400).json({
      message: "Task field is required"
      });
     };
     const newTodo = { id: todos.length + 1, ...req.body }; // Auto-ID
     todos.push(newTodo);
     res.status(201).json(newTodo); // Echo back
   } catch (error) {
   next(error);
     }

 });





// PATCH Update – Partial
app.patch('/todos/:id', validatePatch, (req, res, next) => {
   try {
      const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
      if (!todo) return res.status(404).json({ message: 'Todo not found' });
      Object.assign(todo, req.body); // Merge: e.g., {completed: true}
      res.status(200).json(todo);
   } catch (error) {
   next(error); 
     }
});




// DELETE Remove
app.delete('/todos/:id', (req, res, next) => {
   try {  
     const id = parseInt(req.params.id);
     const initialLength = todos.length;
     todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
     if (todos.length === initialLength)
     return res.status(404).json({ error: 'Not found' });
     res.status(204).send(); // Silent success
   } catch (error) {
   next(error);
     }
});



app.get('/todos/active', (req, res, next) => {
   try {
     const active = todos.filter((t) => !t.completed);
     res.json(active); // Custom Read!
   } catch (error) { 
   next(error);
     }
});



app.use(errorHandler); //For errors


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
