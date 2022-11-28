const Question = require('../models/question.model');
const pdf = require("pdf-creator-node");
const fs = require("graceful-fs");
const uniqid = require('uniqid');
const formidable = require('formidable');
var Client = require('ftp');
var c = Client();

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
    const countSingle = await Question.find({type: 'singleSelect', category: req.body.category}).countDocuments();
    const countMulti = await Question.find({type: 'multiSelect', category: req.body.category}).countDocuments();
    const countOpen = await Question.find({type: 'open', category: req.body.category}).countDocuments();
    const randomQuestions = {
      singleSelect: [],
      multiSelect: [],
      open: []
    };

    if (countSingle < 2 || countMulti < 2 || countOpen < 2) {
      res.status(404).json({message: 'za mało pytań w wybranej kategorii'})
    } else {
      randomQuestions.singleSelect = await findRandomQuestionsFromCategory(req.body.category, 'singleSelect');
      randomQuestions.multiSelect = await findRandomQuestionsFromCategory(req.body.category, 'multiSelect');
      randomQuestions.open = await findRandomQuestionsFromCategory(req.body.category, 'open');

      res.json(randomQuestions);
    }  

  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

findRandomQuestionsFromCategory = async (category, type) => {
  const count = await Question.find({category: category, type: 'singleSelect'}).countDocuments();
  const rand = Math.floor(Math.random() * count);
  let rand2 = Math.floor(Math.random() * count);
  while (rand2 === rand) {
    rand2 = Math.floor(Math.random() * count);
  };
  const question = await Question.findOne({category: category, type: type}).skip(rand);
  const question2 = await Question.findOne({category: category, type: type}).skip(rand2);
  return [question, question2]
}

exports.deleteQuestion = async  (req, res) => {
  try {
    let message = 'OK';
    const itemToDelete = await Question.findById(req.params.id);
    if (itemToDelete) {
      await Question.deleteOne({ _id: req.params.id });
      if (itemToDelete.img && itemToDelete.img.length) {
        const fileName = itemToDelete.img;
        const filePath = process.cwd() + '/public/uploads/' + fileName;
        await fs.unlinkSync(filePath, (err) => {
        if (err) {
        message = 'Question was removed but image is still on the disk.'
      };
    })
      }
    res.json({ message });
    }
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.saveFile = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {

      if (files.hasOwnProperty('upload')) {
        var oldpath = files.upload.path;
        const fileName = uniqid() + '.' + files.upload.name;
        var newpath = process.cwd() + '/public/uploads/' + fileName;
        // c.connect({
        //   'host': 'server601294.nazwa.pl',
        //   'username': 'server601294',
        //   'password': '240818Mw!',
        // });
        res.json({fileName: fileName, err: err});
        // c.on('ready', function (err) {
        //   res.json({fileName: fileName, err: err});
          // c.rename(oldpath, newpath, function(err) {//only one parameter err is available for rename method.
          //   if (err) throw err;
          // });
      // })

        // fs.rename(oldpath, newpath, async (err) => {
        //   if (err) throw err;
        //   res.json({fileName});
        // })
      }
    })
  } catch(err) {
    res.status(500).json({message: err});
  }
};

exports.postQuestion = async (req, res) => {
  try {
    const {type, questionContent, category, answers, img} = req.body;
          if (type, questionContent, category) {
            const newQuestion = new Question({
            type: type,
            questionContent: questionContent,
            answers: answers ? Object.values(answers) : [],
            category: category,
            img: img ? img : ''
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
  try {
    const html = await fs.readFileSync(process.cwd() + "/documents/templatePDF.html", "utf8");

    const options = {
      format: "A4",
    };
    
    const newFileName = 'document.pdf';
    const path = `${process.cwd()}/documents/${newFileName}`;
    const document = {
      html: html,
      data: req.body,
      path: path,
      type: "",
      filename: newFileName,
    };
    
    await pdf
      .create(document, options)
      .then(() => {
        res.download(path);
      })
      .catch((err) => {
        res.json({message: err, message2: path});
      });
  } catch (err) {
    res.status(500).json({message: err, message2: 'try-catch-blok1'});
  }
};

exports.generateResolvedPdf = async (req, res) => {
  const html = fs.readFileSync(process.cwd() + "/documents/templateResolvedPDF.html", "utf8");
  const options = {
    format: "A4",
  };
  const newFileName = 'documentResolved.pdf';
  const document = {
    html: html,
    data: req.body,
    path: `./documents/${newFileName}`,
    type: "",
  };
  
  pdf
    .create(document, options)
    .then(() => {
      const path = process.cwd() + '/documents/' + newFileName;
      res.download(path);
    })
    .catch(() => {
      res.status(500).json({message: err});
    });
};