const express = require('express');
const router = express.Router();
const { createColumn,
    updateColumn,
    deleteColumn,
    getAllColumnsInBoard,
    getColumnInBoardById,} = require('../controllers/columnsController');




    router.get('/:boardId', getAllColumnsInBoard);
    router.get('/:boardId/:columnId', getColumnInBoardById);
    router.post('/:boardId', createColumn);
    router.put('/:boardId/:columnId', updateColumn);
    router.delete('/:boardId/:columnId', deleteColumn);

    module.exports=router;