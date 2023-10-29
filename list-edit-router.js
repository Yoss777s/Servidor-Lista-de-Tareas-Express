const express = require('express');
const listEditRouter = express.Router();


// Middleware para manejar cuerpo vacio
const postEmptyBody = (req, res, next) => {
    if (req.method === 'POST' && (!req.body || Object.keys(req.body).length === 0)){
        res.status(400).json({ error: 'El cuerpo de la solicitud POST esta vacio.'})
    }else{
        next();
    }
};


// Middleware para informacion invalida 
const postInvalidData = (req, res, next) => {
    if (req.method === 'POST'){
        const { indicator, description } = req.body;
        if(!indicator || !description){
            res.status(400).json({ error: 'Se requiere el indicador y la descripcion para la tarea.'});
        }else{
            next();
        }
    }else{
        next();
    }
};

// Middleware para manejar el cuerpo vacio
const putEmptyBody = (req, res, next) => {
    if (req.method === 'PUT' && (!req.body || Object.keys(req.body).length === 0)){
        res.status(400).json({ error: 'El cuerpo de la solicitud PUT esta vacio.'})
    }else{
        next();
    }
};

// Middleware para informacion invalida 
const putInvalidData = (req, res, next) => {
    if (req.method === 'PUT') {
        const { newDescription } = req.body;
        if (!newDescription) {
            res.status(400).json({ error: 'Se requiere la nueva descripcion para actualizar la tarea.'});
        }else{
            next();
        }
    }else{
        next();
    }
};



listEditRouter.post('/create', postEmptyBody, postInvalidData, (req, res) => {
    const { tasks } = require('./gestion-tareas');
    const {indicator, description } = req.body;

    //Verifica que no se puedan crear tareas con el mismo indicador
    const taskSameIndicator = tasks.find(task => task.indicator === indicator);
 
    if(taskSameIndicator){
        res.status(400).json({ error: `Existe una tarea con el indicador ${indicator}`})
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