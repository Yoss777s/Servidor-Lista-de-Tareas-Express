const express = require('express');
const listEditRouter = express.Router();


listEditRouter.post('/create', (req, res) => {
    const { tasks } = require('./gestion-tareas');
    const {indicator, description } = req.body;
    if (!indicator || !description){
        res.status(400).json({ error: 'Se requiere el indicador y la descripción de la tarea.'});
    }else{
        const newTask = { indicator , description, completed: false};
        tasks.push(newTask);
        res.status(201).json(newTask);
    }
});

listEditRouter.delete('/delete/:indicator', (req, res) => {
    const { tasks } = require('./gestion-tareas');
    const { indicator } = req.params;
    const taskIndex = tasks.findIndex(task => task.indicator === indicator);
    if (taskIndex !== -1){
        tasks.splice(taskIndex, 1);
        res.status(200).json({ message: `Tarea con el indicador ${indicator} eliminada.`})
    }else{
        res.status(400).json({ error: `No se encontro una tarea con el indicador "${indicator}"`});
    }
});

listEditRouter.put('/update/:indicator', (req, res) => {
    const { tasks } = require('./gestion-tareas');
    const { indicator } = req.params;
    const { newDescription } = req.body;

    const task = tasks.find(task => task.indicator === indicator);

    if (task){
        task.description = newDescription;
        res.status(200).json({ message: `Tarea con el indicador ${indicator} actualizada.`});
    }else{
        res.status(400).json({ error: `No se encontro una tarea con el indicador: ${indicator}`})
    }
});

module.exports = listEditRouter;