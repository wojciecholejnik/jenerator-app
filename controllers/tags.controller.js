const Tag = require('../models/tag.model');
const Question = require('../models/question.model');

exports.getTagsForCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const tags = await Tag.find({category: categoryId}).sort({name: 1});
        if (tags && tags.length) {
            res.json(tags);
        } else {
            res.status(404).json({message: 'Nie znaleziono żadnych tagów.'})
        }
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
};

exports.addTag = async (req, res) => {
    const tag = req.body;
    try {
        const isExist = await Tag.find({name: tag.name, category: tag.category});
        if (!isExist.length) {
            await new Tag({name: tag.name, category: tag.category}).save().then(async () => {
                    this.getTagsForCategory(req, res);
                })
        } else {
            res.status(405).json({message: 'Taki tag już istnieje.'})
        }
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
};

exports.deleteTag = async (req, res) => {
    const _id = req.body._id;
    try {
        const isExist = await Tag.findOne({_id: _id});
        if (isExist) {
            const isExsistQuestionWithTag = await Question.find({tags: { "$in" : [_id]}});
            if (isExsistQuestionWithTag.length) {
                res.status(405).json({
                    message: 'Istnieją pytania które są spięte z tym tagiem. Zaktualizuj tagi pytania a następnie usuń wybrany tag.'});
            } else {
                await Tag.deleteOne({_id: _id})
                .then(async () => {
                    await this.getTagsForCategory(req, res);
                });
            }
        } else {
            res.status(404).json({message: 'Taki tag nie istnieje.'})
        }
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
};

exports.editTag = async (req, res) => {
    const _id = req.body._id;
    const newName = req.body.name;
    try {
        const isExist = await Tag.findOne({_id: _id});
        if (isExist) {
            await Tag.updateOne({_id: _id}, {
                $set: {
                    name: newName
                }
            });
            this.getTagsForCategory(req, res);
        } else {
            res.status(404).json({message: 'Taki tag nie istnieje.'})
        }
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
};