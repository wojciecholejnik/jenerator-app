const Test = require('../models/test.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Test.find());
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.postTest = async (req, res) => {
  const {author, questions, category} = req.body;
  
  try {
    const testIsEgzist = await Test.findOne({
      author: author,
      questions: questions,
      category: category,
    });
    if (testIsEgzist) {
      res.status(404).json({message: 'test już istnieje'});
    } else if (author && questions && category) {
      const newTest = new Test({
        author: author,
        questions: questions,
        category: category,
        date: Date.now(),
      });
      await newTest.save();
      res.json({ message: 'OK' });
    } else {
      res.status(500).json({message: 'Za mała ilość danych'});
    }
  } catch(err) {
    res.status(500).json({message: err});
  }
};

exports.deleteTest = async (req, res) => {
  try {
    const itemToDelete = await Test.find({ _id: req.body._id });
    if (itemToDelete) {
      await Test.deleteOne({ _id: req.body._id });
      res.json({ message: 'OK' });
    } else {
      res.status(404).json({ message: 'nie odnaleziono testu' });
    }
    
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};