const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subtaskSchema = new Schema({
  subtaskTitle: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['complete', 'incomplete'], default: 'incomplete' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
});

const cardSchema = new Schema({
  cardTitle: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['todo', 'in progress', 'done'], default: 'todo' },
  subtasks: [subtaskSchema],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },

});

const columnSchema = new Schema({
  columnName: { type: String, required: true },
  cards: [cardSchema],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
});

const boardSchema = new Schema({
  boardName: { type: String, required: true },
  columns: [columnSchema],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },

});

module.exports = mongoose.model('Board', boardSchema);
