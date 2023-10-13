const express = require('express');
const listViewRouter = express.Router();

listViewRouter.get('/completed', (req, res) => {
    const { tasks } = require('./gestion-tareas');
    const completedTasks = tasks.filter(task => task.completed);
    res.json(completedTasks);
  });

listViewRouter.get('/incomplete', (req, res) => {
  const { tasks } = require('./gestion-tareas');
  const incompleteTasks = tasks.filter(task => !task.completed);
  res.json(incompleteTasks);
});

module.exports = listViewRouter;