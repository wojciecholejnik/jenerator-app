const User = require('../models/user.model');

exports.getAll = async (req, res) => {
    try {
      res.json(await User.find());
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  };

  exports.getByEmail = async (req, res) => {
    try {
      const user = await User.find({email: req.params.email});
      if(!user) res.status(404).json({ message: 'Not found' });
      else res.json(user);
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  };