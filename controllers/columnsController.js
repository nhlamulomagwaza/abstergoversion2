const Board = require("../models/KanbanModel");

// GET all columns within a specific board
const getAllColumnsInBoard = async (req, res) => {
  const { boardId } = req.params;
  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.json(board.columns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET a specific column by ID within a specific board
const getColumnInBoardById = async (req, res) => {
  const { boardId, columnId } = req.params;
  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const column = board.columns.id(columnId);
    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    res.json(column);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE a new column within a board
const createColumn = async (req, res) => {
  const { boardId } = req.params;
  const { columnName } = req.body;
  const userId = req.user.id;

  const newColumn = {
    columnName,
    cards: [],
    userId, // Associate the column with the authenticated user
  };

  try {
    const board = await Board.findByIdAndUpdate(
      boardId,
      { $push: { columns: newColumn } },
      { new: true }
    );

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.status(201).json(newColumn);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE a column within a board

const updateColumn = async (req, res) => {
  const { boardId, columnId } = req.params;
  const { columnName } = req.body;
  const userId = req.user.id;

  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const columnToUpdate = board.columns.id(columnId);
    if (!columnToUpdate) {
      return res.status(404).json({ message: "Column not found" });
    }

    if (columnToUpdate.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    columnToUpdate.columnName = columnName;

    await board.save();
    res.json(columnToUpdate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE a column within a board
const deleteColumn = async (req, res) => {
  const { boardId, columnId } = req.params;
  const userId = req.user.id;

  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const columnIndex = board.columns.findIndex(
      (column) => column._id.toString() === columnId
    );
    if (columnIndex === -1) {
      return res.status(404).json({ message: "Column not found" });
    }

    const columnToDelete = board.columns[columnIndex];
    if (columnToDelete.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    board.columns.splice(columnIndex, 1);
    await board.save();

    res.json({ message: "Column deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createColumn,
  updateColumn,
  deleteColumn,
  getAllColumnsInBoard,
  getColumnInBoardById,
};
