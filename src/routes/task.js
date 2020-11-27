import express from 'express';

import {
  getTasks,
  createTask,
  editTask,
  deleteTask,
  reorderTasks,
} from 'controllers/task';

const taskRouter = express.Router();

taskRouter.get('/', getTasks);
taskRouter.post('/', createTask);
taskRouter.put('/:id', editTask);
taskRouter.delete('/:id', deleteTask);
taskRouter.post('/reorder', reorderTasks);

export default taskRouter;
