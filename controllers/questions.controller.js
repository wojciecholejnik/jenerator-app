const Question = require('../models/question.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Question.find());
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getByCategory = async (req, res) => {
  try {
    const user = await Question.find({category: req.params.category});
    if(!user) res.status(404).json({ message: 'Not found' });
    else res.json(user);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getBycategoryAndType = async (req, res) => {
  try {
    const user = await Question.find({category: req.params.category, type: req.params.type});
    if(!user) res.status(404).json({ message: 'Not found' });
    else res.json(user);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  console.log('req.body: ', req.body)
  try {
    const count = await Question.find({category: req.params.category, type: req.params.type}).countDocuments();
    const rand = Math.floor(Math.random() * count);
    const user = await Question.findOne({category: req.params.category, type: req.params.type}).skip(rand);
    if(!user) res.status(404).json({ message: 'Not found' });
    else res.json(user);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.postQuestion = async (req, res) => {
  const [key, cos] = Object.entries(req.body);
  const odp = JSON.parse(key[0]);
  const {type, questionContent, answers, category, img} = odp;

  console.log('type: ', type);
  console.log('questionContent: ', questionContent);
  console.log('answers: ', Object.values(answers));
  console.log('category: ', category);
  console.log('img: ', img);

  try {
    if (type, questionContent, category) {
      const newQuestion = new Question({
        type: type,
        questionContent: questionContent,
        answers: answers ? Object.values(answers) : [],
        category: category,
        img: img ? img : null
      });
      await newQuestion.save();
      res.json({ message: 'OK' });
    } else {
      console.log('NIe podales wszystkich parametrow')
    }


  } catch(err) {

    res.status(500).json({message: err});
  }
};