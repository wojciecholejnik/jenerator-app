const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  category: { type: String, required: true },
  type: { type: String, required: true },
  questionContent: { type: String, required: true },
  answers: { type: Array, required: false },
  img: { type: String, required: false },
});

module.exports = mongoose.model('Question', questionSchema);