const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  author: {type: String, required: true},
  date: {type: String, required: true},
  questions: {type: Object, required: true},
  category: { type: String, required: true },
});

module.exports = mongoose.model('Test', testSchema);