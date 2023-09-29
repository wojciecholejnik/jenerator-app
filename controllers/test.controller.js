const Test = require('../models/test.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Test.find());
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.addTest = async (req, res) => {
  const {author, questions, category, name} = req.body;
  
  try {
    const testIsExist = await Test.findOne({
      name: name
    });
    if (testIsExist) {
      res.status(422).json({message: 'Test o takiej nazwie już istnieje.'});
    } else if (author && questions && category && name) {
      const newTest = new Test(req.body);
      await newTest.save();
      this.getAll(req, res);
    } else if (author && questions && category && !name) {
      const newTest = new Test({...req.body, name: !name && !name.length ? category.name + ' - ' + new Date().toLocaleDateString() : name});
      await newTest.save();
      this.getAll(req, res);
    } else {
      res.status(500).json({message: 'Za mała ilość danych'});
    }
  } catch(err) {
    res.status(500).json({message: err});
  }
};

exports.deleteTest = async (req, res) => {
  try {
    const itemToDelete = await Test.findById(req.params.id);
    if (itemToDelete) {
      await Test.deleteOne({ _id: req.params.id });
      this.getAll(req, res);
    } else {
      res.status(404).json({ message: 'Taki test już nie istnieje.' });
    }
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};