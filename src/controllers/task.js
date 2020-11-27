import prisma from 'prisma';

const getTasks = async (req, res) => {
  try {
    const { user: { id } } = req.headers;
    const tasks = await prisma.task.findMany({ where: { userId: id } });
    res.status(200).json(tasks.sort((next, prev) => (next.order > prev.order ? 1 : -1)));
  } catch (e) {
    res.status(422).json({ error: e.message, raw: e });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title) {
      return res.status(422).json({ error: 'Task should have a title' });
    }
    const { user: { id } } = req.headers;
    const tasks = await prisma.task.findMany({ where: { userId: id } });
    const max = tasks.reduce((acc, current) => (current.order > acc ? current.order : acc), 0);
    const task = await prisma.task.create({
      data: {
        title, body, order: max + 1, user: { connect: { id } },
      },
    });
    res.status(200).json(task);
  } catch (e) {
    res.status(422).json({ error: e.message, raw: e });
  }
};

const editTask = async (req, res) => {
  try {
    const {
      id, title, body, order, completed,
    } = req.body;
    const task = await prisma.task.update({
      where: { id },
      data: {
        title, body, order, completed,
      },
    });
    res.status(200).json(task);
  } catch (e) {
    res.status(422).json({ error: e.message, raw: e });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({ where: { id } });
    res.status(200).json({ deleted: id });
  } catch (e) {
    res.status(422).json({ error: e.message, raw: e });
  }
};

const reorderTasks = async (req, res) => {
  try {
    const { items } = req.body;
    const requests = items.map(({ id, order }) => prisma.task.update({
      where: { id },
      data: { order },
    }));
    await Promise.all(requests);
    res.status(200).json({ reordered: true });
  } catch (e) {
    res.status(422).json({ error: e.message, raw: e });
  }
};

export {
  getTasks,
  createTask,
  editTask,
  deleteTask,
  reorderTasks,
};
