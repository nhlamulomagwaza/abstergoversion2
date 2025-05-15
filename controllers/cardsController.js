const Board = require("../models/KanbanModel");

// CREATE a new card within a specific column of a board

const createCard = async (req, res) => {
  const { boardId, columnId } = req.params;
  const { cardTitle, description, status, subtasks } = req.body;
  const userId = req.user.id;

  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.s(404).json({ message: "Board not found" });
    }

    const column = board.columns.id(columnId);
    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    const newCard = { cardTitle, description, status, userId }; // Create a new card object with status and userId

    // If subtasks are provided, add them to the newCard object
    if (subtasks) {
      newCard.subtasks = subtasks.map((subtask) => ({
        subtaskTitle: subtask.subtaskTitle,
        completed: subtask.completed,
        userId,
      }));
    }

    column.cards.push(newCard); // Add the new card to the column
    await board.save();

    res.status(201).json(newCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// UPDATE a card within a specific column of a board

const updateCard = async (req, res) => {
  const { boardId, cardId, newColumnId } = req.params;
  const { cardTitle, description, status, subtasks } = req.body;
  const userId = req.user.id;

  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const cardToUpdate = board.columns
      .flatMap((column) => column.cards)
      .find((card) => card._id.toString() === cardId);
    if (!cardToUpdate) {
      return res.status(404).json({ message: "Card not found" });
    }

    if (cardToUpdate.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const newColumn = board.columns.id(newColumnId);
    if (!newColumn) {
      return res.status(404).json({ message: "Column not found" });
    }

    const currentColumn = board.columns
      .flatMap((column) => column.cards)
      .find((card) => card._id.toString() === cardId)
      .parent();
    currentColumn.cards.pull(cardToUpdate);
    newColumn.cards.push(cardToUpdate);

    if (cardTitle) {
      cardToUpdate.cardTitle = cardTitle;
    }

    // Save the new description, even if it's an empty string
    cardToUpdate.description =
      description !== undefined ? description : cardToUpdate.description;

    if (status) {
      cardToUpdate.status = status;
    }

    if (subtasks) {
      cardToUpdate.subtasks = subtasks.map((subtask) => ({
        subtaskTitle: subtask.subtaskTitle,
        completed: subtask.completed,
        userId,
      }));
    }

    await board.save();
    res.json(cardToUpdate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// DELETE a card within a specific column of a board
const deleteCard = async (req, res) => {
  const { boardId, columnId, cardId } = req.params;
  const userId = req.user.id;

  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const column = board.columns.id(columnId);
    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    const cardIndex = column.cards.findIndex(
      (card) => card._id.toString() === cardId
    );
    if (cardIndex === -1) {
      return res.status(404).json({ message: "Card not found" });
    }

    const cardToDelete = column.cards[cardIndex];
    if (cardToDelete.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    column.cards.splice(cardIndex, 1);
    await board.save();

    res.json({ message: "Card deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all cards within a specific board
const getAllCardsInBoard = async (req, res) => {
  const { boardId } = req.params;
  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    let allCards = [];
    board.columns.forEach((column) => {
      allCards = allCards.concat(column.cards);
    });

    res.json(allCards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET a specific card by ID within a specific board
const getCardInBoardById = async (req, res) => {
  const { boardId, cardId } = req.params;
  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    let foundCard = null;
    board.columns.forEach((column) => {
      const card = column.cards.id(cardId);
      if (card) {
        foundCard = card;
      }
    });

    if (!foundCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json(foundCard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createCard,
  updateCard,
  deleteCard,
  getAllCardsInBoard,
  getCardInBoardById,
};
