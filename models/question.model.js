const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  category: { type: String, required: true, ref: 'categories' },
  type: { type: String, required: true },
  questionContent: { type: String, required: true },
  answers: { type: Array, required: false },
  img: { type: String, required: false },
  author: {type: String, required: true, ref: 'users'},
  creationDate: {type: Date, required: true},
  blocked: {type: Boolean, required: true},
  species: {type: Number, required: true},
  tags: {type: Array, required: true, ref: 'tags'}
});

module.exports = mongoose.model('Question', questionSchema);