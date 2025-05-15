const Board = require('../models/KanbanModel');

// GET a subtask
const getSubtask = async (req, res) => {
  const { boardId, columnId, cardId, subtaskId } = req.params;

  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const card = board.columns.id(columnId).cards.id(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const subtask = card.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: 'Subtask not found' });
    }

    res.json(subtask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE a new subtask
const createSubtask = async (req, res) => {
  const { boardId, columnId, cardId } = req.params;
  const { subtaskTitle, description, status } = req.body;
  const userId = req.user.id; 

  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const card = board.columns.id(columnId).cards.id(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const newSubtask = { subtaskTitle, description, status, userId };
    card.subtasks.push(newSubtask);
    await board.save();

    res.status(201).json(newSubtask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE a subtask
const updateSubtask = async (req, res) => {
  const { boardId, columnId, cardId, subtaskId } = req.params;
  const { subtaskTitle, description, status } = req.body;
  const userId = req.user.id; 

  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const card = board.columns.id(columnId).cards.id(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const subtask = card.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: 'Subtask not found' });
    }

    // Check if the authenticated user is the owner of the subtask
    if (subtask.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (subtaskTitle) subtask.subtaskTitle = subtaskTitle;
    if (description) subtask.description = description;
    if (status) subtask.status = status;

    await board.save();

    res.json(subtask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// DELETE a subtask
const deleteSubtask = async (req, res) => {
  const { boardId, columnId, cardId, subtaskId } = req.params;
  const userId = req.user.id; 

  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const card = board.columns.id(columnId).cards.id(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const subtaskIndex = card.subtasks.findIndex(subtask => subtask._id.toString() === subtaskId);
    if (subtaskIndex === -1) {
      return res.status(404).json({ message: 'Subtask not found' });
    }

    const subtask = card.subtasks[subtaskIndex];

    // Check if the authenticated user is the owner of the subtask
    if (subtask.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    card.subtasks.splice(subtaskIndex, 1);
    await board.save();

    res.json({ message: 'Subtask deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getSubtask,
  createSubtask,
  updateSubtask,
  deleteSubtask,
};