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

  exports.getUsersToManage = async (req, res) => {
    try {
      const users = await User.find(
        { $and : [ { "_id" : { $ne : "6171b38fbf5e58cf61a943da" } }, { "_id" : { $ne : "6171b319bf5e58cf61a943d9" } } ] }
        ).select('-password');
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

  exports.addNewUser = async (req, res) => {
    try {
      const user = await new User(req.body);
      await user.save();
      await this.getUsersToManage(req, res)
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  }

  exports.deleteUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).message({message: "Nie ma takiego użytkownika."})
      } else {
        await User.findByIdAndDelete(req.params.id)
        .then(async () => {
          await this.getUsersToManage(req, res)
        })
      }
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  }

  exports.editUser = async (req, res) => {
    try {
      const id = req.body._id
      const editedUser = req.body;
      delete editedUser._id;
      const userToEdit = await User.findById(id);
      if (!userToEdit) {
        res.status(404).json({message: 'Nie znaleziono użytkownika'});
      } else {
        await User.updateOne({_id: id},{
          $set: editedUser
        })
        this.getUsersToManage(req, res);
      }
    } catch (e) {

    }
  }