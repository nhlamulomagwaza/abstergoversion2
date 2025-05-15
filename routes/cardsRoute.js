const express = require('express');
const router = express.Router();
const {
    getAllCardsInBoard,
    getCardInBoardById,
    createCard,
    updateCard,
    deleteCard,
  } = require('../controllers/cardsController');

    router.get('/:boardId', getAllCardsInBoard);
router.get('/:boardId/:cardId', getCardInBoardById);
router.post('/:boardId/:columnId', createCard);
router.put('/:boardId/:cardId/:newColumnId', updateCard);
router.delete('/:boardId/:columnId/:cardId', deleteCard);



module.exports= router;