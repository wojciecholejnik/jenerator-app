const User = require('../models/user.model');

  exports.login = async (req, res) => {
    try {
      const user = await User.find({email: req.params.email, password: req.params.password});
      if (!user.length) {
        res.status(404).json({ message: 'invalid data'});
      } else {
        res.json(user);
      }
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  };

  exports.changePassword = async (req, res) => {
    try {
      const user = await User.find({_id: req.body.userId});
      if (!user.length) {
        res.status(404).json({ message: 'brak użytwkonika !'});
      } else {
        await User.updateOne({ _id: req.body.userId }, { $set: { 
          password: req.body.newPassword,
        }});
        res.json({ message: 'OK' });
      }
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  };

  exports.changeName = async (req, res) => {
    try {
      const user = await User.find({_id: req.body.userId});
      if (!user.length) {
        res.status(404).json({ message: 'brak użytwkonika !'});
      } else {
        await User.updateOne({ _id: req.body.userId }, { $set: { 
          displayName: req.body.newName,
        }}).then(() => res.json({ message: 'OK' }))
      }
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  };

  exports.changeLogin = async (req, res) => {
    try {
      const user = await User.find({_id: req.body.userId});
      if (!user.length) {
        res.status(404).json({ message: 'brak użytwkonika !'});
      } else {
        await User.updateOne({ _id: req.body.userId }, { $set: { 
          email: req.body.newLogin,
        }}).then(() => res.json({ message: 'OK' }))
      }
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  };

  exports.changeEmoticon = async (req, res) => {
    try {
      const user = await User.find({_id: req.body.userId});
      if (!user.length) {
        res.status(404).json({ message: 'brak użytwkonika !'});
      } else {
        await User.updateOne({ _id: req.body.userId }, { $set: { 
          emoticon: req.body.newEmoticon,
        }}).then(() => res.json({ message: 'OK' }))
      }
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  };