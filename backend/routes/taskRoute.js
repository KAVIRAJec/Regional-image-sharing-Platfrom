const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/users', taskController.getAllTasks);
router.get('/users/:location', taskController.getTaskByLocation);
router.post('/users/auth', taskController.getTaskByAuth);//signin
router.post('/users', taskController.addTask);//register
router.put('/users/:id', taskController.updateTask);
router.delete('/users/:id', taskController.deleteTask);

module.exports = router;
