import Task from "../models/Task.js";

/*
 *  @desc   get all tasks
 */
const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status) filter.status = status;

    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    } else {
      tasks = await Task.find({
        ...filter,
        assignedTo: req.user._id,
      }).populate("assignedTo", "name email profileImageUrl");
    }

    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoChecklist.filter(
          (item) => item.completed
        ).length;

        return { ...task._doc, completedTodoCount: completedCount };
      })
    );

    const allTasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user._id }
    );

    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "Pending",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    const inProgressTasks = await Task.countDocuments({
      ...filter,
      status: "In Progress",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "Completed",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    res.json({
      tasks,
      statusSummary: {
        all: allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "server error!", error: error.message });
  }
};

/*
 *  @desc   get task by id
 */
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "server error!", error: error.message });
  }
};

/*
 *  @desc   create task
 */
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist,
    } = req.body;

    if (!Array.isArray(assignedTo)) {
      return res
        .status(400)
        .json({ message: "assignedTo must be array" });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      todoChecklist,
      attachments,
    });

    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    res.status(500).json({ message: "server error!", error: error.message });
  }
};

/*
 *  @desc   update task
 */
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    Object.assign(task, req.body);

    const updatedTask = await task.save();

    res.json({ message: "Task updated", updatedTask });
  } catch (error) {
    res.status(500).json({ message: "server error!", error: error.message });
  }
};

/*
 *  @desc   delete task
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.deleteOne();

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "server error!", error: error.message });
  }
};

/*
 *  @desc   update status
 */
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = req.body.status || task.status;

    await task.save();

    res.json({ message: "Status updated", task });
  } catch (error) {
    res.status(500).json({ message: "server error!", error: error.message });
  }
};

/*
 *  @desc   update checklist
 */
const updateTaskChecklist = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    task.todoChecklist = req.body.todoChecklist;

    await task.save();

    res.json({ message: "Checklist updated", task });
  } catch (error) {
    res.status(500).json({ message: "server error!", error: error.message });
  }
};

/*
 *  @desc   dashboard (admin)
 */
const getDashboardData = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();

    res.json({ totalTasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
 *  @desc   dashboard (user)
 */
const getUserDashboardData = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({
      assignedTo: req.user._id,
    });

    res.json({ totalTasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ EXPORT
export {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData,
};