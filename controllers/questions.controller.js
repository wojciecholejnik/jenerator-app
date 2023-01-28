const Question = require('../models/question.model');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const pdf = require("pdf-creator-node");
const fs = require("fs");
const uniqid = require('uniqid');
const formidable = require('formidable');

exports.getByCategory = async (req, res) => {
  try {
    const questions = await Question.find({category: req.params.categoryId}).populate([{
      path: 'category',
      model: Category
    },
    {
      path: 'author',
      model: User,
      select: 'shortName'
    }]).sort({questionContent: 1});
    if(!questions) res.status(404).json({ message: 'Not found' });
    else res.json(questions);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const questionDTO = req.body;
    const existingQuestion = await Question.find(
      {questionContent: questionDTO.questionContent, category: questionDTO.category}
    );
    if (existingQuestion.length) {
      res.status(405).json({message: 'Takie pytanie już istnieje w tej kategorii !'})
    } else {
      const question = await new Question({...questionDTO, creationDate: new Date()});
      await question.save();
      await this.getByCategory(req, res);
    }
  } catch (e) {
    res.status(500).json({mesage: e})
  }
}

exports.deleteQuestion = async  (req, res) => {
  try {
    const itemToDelete = await Question.findById(req.params.questionId);
    if (itemToDelete) {
      await Question.deleteOne({ _id: req.params.questionId });
      this.getByCategory(req, res);
    } else {
      res.status(404).json({ message: "Pytanie nie zostało odnalezione" });
    }
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

// exports.getBycategoryAndType = async (req, res) => {
//   try {
//     const user = await Question.find({category: req.params.category, type: req.params.type});
//     if(!user) res.status(404).json({ message: 'Not found' });
//     else res.json(user);
//   }
//   catch(err) {
//     res.status(500).json({ message: err });
//   }
// };

// exports.getRandom = async (req, res) => {
//   try {
//     const countSingle = await Question.find({type: 'singleSelect', category: req.body.category}).countDocuments();
//     const countMulti = await Question.find({type: 'multiSelect', category: req.body.category}).countDocuments();
//     const countOpen = await Question.find({type: 'open', category: req.body.category}).countDocuments();
//     const randomQuestions = {
//       singleSelect: [],
//       multiSelect: [],
//       open: []
//     };

//     if (countSingle < 2 || countMulti < 2 || countOpen < 2) {
//       res.status(404).json({message: 'za mało pytań w wybranej kategorii'})
//     } else {
//       randomQuestions.singleSelect = await findRandomQuestionsFromCategory(req.body.category, 'singleSelect');
//       randomQuestions.multiSelect = await findRandomQuestionsFromCategory(req.body.category, 'multiSelect');
//       randomQuestions.open = await findRandomQuestionsFromCategory(req.body.category, 'open');

//       res.json(randomQuestions);
//     }  

//   }
//   catch(err) {
//     res.status(500).json({ message: err });
//   }
// };

// findRandomQuestionsFromCategory = async (category, type) => {
//   const count = await Question.find({category: category, type: 'singleSelect'}).countDocuments();
//   const rand = Math.floor(Math.random() * count);
//   let rand2 = Math.floor(Math.random() * count);
//   while (rand2 === rand) {
//     rand2 = Math.floor(Math.random() * count);
//   };
//   const question = await Question.findOne({category: category, type: type}).skip(rand);
//   const question2 = await Question.findOne({category: category, type: type}).skip(rand2);
//   return [question, question2]
// }



// exports.saveFile = async (req, res) => {
//   try {
//     const form = new formidable.IncomingForm();
//     form.parse(req, async (err, fields, files) => {

//       if (files.hasOwnProperty('upload')) {
//         var oldpath = files.upload.path;
//         const fileName = uniqid() + '.' + files.upload.name;
//         var newpath = process.cwd() + '/public/uploads/' + fileName;
//         fs.rename(oldpath, newpath, async (err) => {
//           if (err) throw err;
//           res.json({fileName});
//         })
//       }
//     })
//   } catch(err) {
//     res.status(500).json({message: err});
//   }
// };

// exports.postQuestion = async (req, res) => {
//   try {
//     const {type, questionContent, category, answers, img} = req.body;
//           if (type, questionContent, category) {
//             const newQuestion = new Question({
//             type: type,
//             questionContent: questionContent,
//             answers: answers ? Object.values(answers) : [],
//             category: category,
//             img: img ? img : ''
//           });
//           await newQuestion.save();
//           res.json({ message: 'OK' });
//         } else {
//           res.status(500).json({message: 'Za mała ilość danych'});
//         }
//   } catch(err) {
//     res.status(500).json({message: err});
//   }
// };

// exports.updateQuestion = async (req, res) => {
//   const {type, questionContent, answers, category, img} = req.body;
  
//   try {
//     if (type, questionContent, category) {

//       await Question.updateOne({ _id: req.params.id }, { $set: { 
//         type: type,
//         questionContent: questionContent,
//         answers: answers ? Object.values(answers) : [],
//         category: category,
//         img: img ? img : null
//       }});
//       res.json({ message: 'OK' });
//     } else {
//       res.status(500).json({message: 'Za mała ilość danych'});
//     }
//   } catch(err) {
//     res.status(500).json({message: err});
//   }
// };

// exports.generateTestPdf = async (req, res) => {
//   const html = fs.readFileSync("templatePDF.html", "utf8");
//   const options = {
//     format: "A4",
//   };
  
//   const document = {
//     html: html,
//     data: req.body,
//     path: `./document.pdf`,
//     type: "",
//   };
  
//   pdf
//     .create(document, options)
//     .then((document) => {
//       res.sendFile(document.filename);
//     })
//     .catch(() => {
//       res.status(500).json({message: err});
//     });
// };

// exports.generateResolvedPdf = async (req, res) => {
//   const html = fs.readFileSync("templateResolvedPDF.html", "utf8");
//   const options = {
//     format: "A4",
//   };
  
//   const document = {
//     html: html,
//     data: req.body,
//     path: `./documentResolved.pdf`,
//     type: "",
//   };
  
//   pdf
//     .create(document, options)
//     .then((document) => {
//       res.sendFile(document.filename);
//     })
//     .catch(() => {
//       res.status(500).json({message: err});
//     });
// };