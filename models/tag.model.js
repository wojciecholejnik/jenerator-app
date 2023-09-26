const mongoose = require('mongoose');

const tagsSchema = new mongoose.Schema({
  category: { type: String, required: true, ref: 'categories' },
  name: {type: String, required:  true}
});

module.exports = mongoose.model('Tags', tagsSchema);