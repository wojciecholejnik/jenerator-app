const User = require('../models/user.model');
  exports.login = async (req, res) => {
    try {
      const user = await User.find({email: req.params.email, password: req.params.password});
      if(!user) res.status(404).json({ message: 'Not found' });
      else res.json(user);
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  };