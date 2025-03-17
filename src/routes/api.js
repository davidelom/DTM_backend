const express = require('express');
const router = express.Router();
const apiController = require("../controllers/apiController");
const taskCounter = require('../middlewares/taskCount');

router.use(taskCounter);

router.get('/', apiController.getAllTasks);

router.post('/', apiController.createTask);
router.put('/:id', apiController.updateTask);
router.delete('/:id', apiController.deleteTask);
router.get('/edit/:id', apiController.getEditId);

module.exports = router;
