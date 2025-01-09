const Task = require('../models/task');

module.exports = {
    getAllByUser: async (req, res) => {
        try {
            const tasks = await Task.getAllByUser(req.user.id);
            const remainingTasks = tasks.filter(task => !task.completed).length;
            res.locals.remainingTasks = remainingTasks;
            res.render('task/tasks', { 
                tasks: tasks,
                error: null,
                user: req.session.user || null 
            });
        } catch (err) {
            return res.render('task/tasks', { 
                error: 'Erreur lors de la récupération des tâches',
                tasks: [],
                user: req.session.user || null 
            });
        }
    },

    createTask: async (req, res) => {
        const { title, description, completed = false } = req.body;
        try {
            const task = await Task.create({ title, description, completed, user_id: req.user.id });
            res.redirect('/tasks');
        } catch (err) {
            res.status(500).send('Erreur lors de la création de la tâche.');
        }
    },

    updateTask: async (req, res) => {
        const { id } = req.params;
        const { title, description, completed } = req.body;
        try {
            const task = await Task.update(id, { title, description, completed });
            res.json(task);
        } catch (err) {
            res.status(404).send(err.message);
        }
    },

    deleteTask: async (req, res) => {
        const { id } = req.params;
        try {
            await Task.delete(id);
            res.status(200).json({ success: true, message: 'Tâche supprimée avec succès' });
        } catch (err) {
            res.status(404).json({ success: false, error: err.message });
        }
    },   

    getEditId: async (req, res) => {
        const taskId = req.params.id;
        
        try {
            const { task } = await Task.getTaskId(taskId);

            if(task.error){
                return res.render('task/tasks', { 
                    error: 'Erreur lors de la récupération de la tâche',
                    user: req.session.user || null 
                });
            } 
            
            res.render('task/edit-task', { 
                task,
                error: null,
                user: req.session.user || null 
            });
            
            //res.render('dashboard', { tasks, user: req.user });
        } catch (err) {
            res.status(500).send('Erreur lors de la récupération des tâches.');
        }
    },

    updateTask: async (req, res) => {
        const { id } = req.params;
        const { title, description, completed } = req.body;
        
        try {
            const task = await Task.update(id, { title, description, completed });
            res.json({ success: true, task });
        } catch (err) {
            res.status(404).json({ success: false, error: err.message });
        }
    },
    
};
