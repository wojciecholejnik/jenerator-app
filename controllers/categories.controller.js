const Category = require('../models/category.model');
const Question = require('../models/question.model');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({name: 1});
        if (categories && categories.length) {
            res.json(categories);
        } else {
            res.status(404).json({message: 'Nie znaleziono żadnych kategorii.'})
        }
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
};

exports.addCategory = async (req, res) => {
    const name = req.body.name;
    try {
        const isExist = await Category.find({name: name});
        if (!isExist.length) {
            const category = await new Category({name: name});
            if (category) {
                category.save().then(async () => {
                    this.getAllCategories(req, res);
                })
            } else {
                res.status(410).json({message: 'Nie udało się stworzyc nowej kategorii.'})
            }
        } else {
            res.status(405).json({message: 'Taka kategoria już istnieje.'})
        }
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
};

exports.deleteCategory = async (req, res) => {
    const _id = req.body._id;
    try {
        const isExist = await Category.findOne({_id: _id});
        if (isExist) {
            await Category.deleteOne({_id: _id})
            .then(async () => {
                await Question.deleteMany({category: _id})
            .then(async () => {
                await this.getAllCategories(req, res);
            })
            });
        } else {
            res.status(404).json({message: 'Taka kategoria nie istnieje.'})
        }
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
};

exports.editCategory = async (req, res) => {
    const _id = req.body._id;
    const newName = req.body.newName;
    try {
        const isExist = await Category.findOne({_id: _id});
        if (isExist) {
            await Category.updateOne({_id: _id}, {
                $set: {
                    name: newName
                }
            });
            this.getAllCategories(req, res);
        } else {
            res.status(404).json({message: 'Taka kategoria nie istnieje.'})
        }
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
};