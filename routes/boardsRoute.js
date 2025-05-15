const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardsController');

// Routes
router.get('/', boardController.getAllBoards);
router.get('/:boardId', boardController.getBoardById);
router.post('/', boardController.createBoard);
router.put('/:boardId', boardController.updateBoard);
router.delete('/:boardId', boardController.deleteBoard);

module.exports = router;