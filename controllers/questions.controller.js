const Question = require('../models/question.model');
const pdf = require("pdf-creator-node");
const fs = require("fs");

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
  try {
    const countSingle = await Question.find({type: 'singleSelect', category: req.params.category}).countDocuments();
    const countMulti = await Question.find({type: 'multiSelect', category: req.params.category}).countDocuments();
    const countOpen = await Question.find({type: 'open', category: req.params.category}).countDocuments();
    if (countSingle < 2 || countMulti < 2 || countOpen < 2) {
      res.status(404).json({message: 'za mało pytań w wybranej kategorii'})
    } else {
      const count = await Question.find({category: req.params.category, type: req.params.type}).countDocuments();
      const rand = Math.floor(Math.random() * count);
      let rand2 = Math.floor(Math.random() * count);
      while (rand2 === rand) {
        rand2 = Math.floor(Math.random() * count);
      };
      const question = await Question.findOne({category: req.params.category, type: req.params.type}).skip(rand);
      const question2 = await Question.findOne({category: req.params.category, type: req.params.type}).skip(rand2);
      const questions = [question, question2];
      if(!question && !question2) res.status(404).json({ message: 'Not found' });
      else res.json(questions);
    }  

  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.deleteQuestion = async  (req, res) => {
  try {
    const itemToDelete = await Question.find({ _id: req.params.id });
    await Question.deleteOne({ _id: req.params.id });
    res.json({ message: 'OK' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.postQuestion = async (req, res) => {
  const {type, questionContent, answers, category, img} = req.body;
  
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
      res.status(500).json({message: 'Za mała ilość danych'});
    }
  } catch(err) {
    res.status(500).json({message: err});
  }
};

exports.updateQuestion = async (req, res) => {
  const {type, questionContent, answers, category, img} = req.body;
  
  try {
    if (type, questionContent, category) {

      await Question.updateOne({ _id: req.params.id }, { $set: { 
        type: type,
        questionContent: questionContent,
        answers: answers ? Object.values(answers) : [],
        category: category,
        img: img ? img : null
      }});
      res.json({ message: 'OK' });
    } else {
      res.status(500).json({message: 'Za mała ilość danych'});
    }
  } catch(err) {
    res.status(500).json({message: err});
  }
};

exports.generateTestPdf = async (req, res) => {
  const html = fs.readFileSync("templatePDF.html", "utf8");
  const options = {
    format: "A4",
  };
  
  const document = {
    html: html,
    data: req.body,
    path: `./document.pdf`,
    type: "",
  };
  
  pdf
    .create(document, options)
    .then((document) => {
      res.sendFile(document.filename);
    })
    .catch(() => {
      res.status(500).json({message: err});
    });
};

exports.generateResolvedPdf = async (req, res) => {
  const html = fs.readFileSync("templateResolvedPDF.html", "utf8");
  const options = {
    format: "A4",
  };
  
  const document = {
    html: html,
    data: req.body,
    path: `./documentResolved.pdf`,
    type: "",
  };
  
  pdf
    .create(document, options)
    .then((document) => {
      res.sendFile(document.filename);
    })
    .catch(() => {
      res.status(500).json({message: err});
    });
};