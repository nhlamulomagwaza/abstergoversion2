// routes/index.js
const express = require('express');
const router = express.Router();


const {
    getSubtask,
    createSubtask,
    updateSubtask,
    deleteSubtask,

} = require('../controllers/subtasksController');


router.get('/:boardId/:columnId/:cardId/:subtaskId', getSubtask);
router.post('/:boardId/:columnId/:cardId', createSubtask);
router.put('/:boardId/:columnId/:cardId/:subtaskId', updateSubtask);
router.delete('/:boardId/:columnId/:cardId/:subtaskId', deleteSubtask);






module.exports = router;