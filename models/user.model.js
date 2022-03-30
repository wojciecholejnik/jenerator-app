const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  displayName: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
  shortName: { type: String, required: true},
  emoticon: {type: String, required: true},
  background: {type: String, required: true}
});

module.exports = mongoose.model('User', userSchema);