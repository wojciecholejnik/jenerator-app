const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: {type: String, required: true},
  author: {
    _id: {type: String, required: true},
    shortName: {type: String, required: true}
  },
  category: {
    _id: {type: String, required: true},
    name: {type: String, required: true}
  },
  date: {type: Date, required: true},
  questions: {type: Array, required: true},
});

module.exports = mongoose.model('Test', testSchema);