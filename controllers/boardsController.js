const Board = require("../models/KanbanModel");
const mongoose = require("mongoose");
// GET all boards
const getAllBoards = async (req, res) => {
  const userId = req.user.id;

  try {
    const boards = await Board.find({ userId });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET a board by ID
const getBoardById = async (req, res) => {
  const { boardId } = req.params;
  const userId = req.user.id;

  try {
    const board = await Board.findById(boardId);
    if (!board || board.userId.toString() !== userId) {
      return res.status(404).json({ message: "Board not found" });
    }
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE a new board with optional columns
const createBoard = async (req, res) => {
  const { boardName, columns = [] } = req.body;
  const userId = req.user.id;

  const newBoard = new Board({
    boardName,
    columns, // Use the provided columns or initialize with empty array
    userId, // Associate the board with the authenticated user
  });

  try {
    const createdBoard = await newBoard.save();
    res.status(201).json(createdBoard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE a board
const updateBoard = async (req, res) => {
  const { boardId } = req.params;
  const { boardName, columns } = req.body;
  const userId = req.user.id;

  try {
    const originalBoard = await Board.findById(boardId);

    if (!originalBoard) {
      return res.status(404).json({ message: "Board not found" });
    }

    if (originalBoard.userId.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Update boardName if provided
    if (boardName) {
      originalBoard.boardName = boardName;
    }

    // Add new columns to the existing ones, excluding duplicates
    if (columns) {
      const existingColumnNames = originalBoard.columns.map(
        (column) => column.columnName
      );
      const newColumns = columns.filter(
        (column) => !existingColumnNames.includes(column.columnName)
      );
      originalBoard.columns = [...originalBoard.columns, ...newColumns];
    }

    const updatedBoard = await originalBoard.save();
    console.log("originalBoard after update:", updatedBoard);

    res.json(updatedBoard);
  } catch (err) {
    console.log("error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// DELETE a board
const deleteBoard = async (req, res) => {
  const { boardId } = req.params;
  const userId = req.user.id;

  try {
    const deletedBoard = await Board.findByIdAndDelete(boardId);

    if (!deletedBoard || deletedBoard.userId.toString() !== userId) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.json({ message: "Board deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
};
