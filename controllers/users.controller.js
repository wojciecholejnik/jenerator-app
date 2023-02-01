const User = require('../models/user.model');

  exports.login = async (req, res) => {
    try {
      const user = await User.findOne({login: req.body.login, password: req.body.password}).select('-password');
      if (!user) {
        res.status(404).json({ message: 'Błędne dane logowania.'});
      } else {
        res.json(user);
      }
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  };

  exports.getUserData = async (req, res) => {
    console.log(req.params.id)
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        res.status(404).json({ message: 'Taki użytkownik nie istnieje.'});
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
          login: req.body.newLogin,
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

  exports.changeBackground = async (req, res) => {
    try {
      const user = await User.find({_id: req.body.userId});
      if (!user.length) {
        res.status(404).json({ message: 'brak użytwkonika !'});
      } else {
        await User.updateOne({ _id: req.body.userId }, { $set: { 
          background: req.body.newBackground,
        }}).then(() => res.json({ message: 'OK' }))
      }
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  }

  exports.getUsersToManage = async (req, res) => {
    try {
      const users = await User.find({isAdmin: false});
      if (!users.length) {
        res.status(404).json({ message: 'Brak użytkowników do wyświetlenia.'});
      } else {
        res.json(users)
      }
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  }