const Exercise = require('../models/exercise.model');

exports.getAll = (req, res) => {
    Exercise.find()
        .then(exercises => res.status(200).json(exercises))
        .catch(error => res.status(400).json({ message: error }));
};

exports.addExercise = (req, res) => {
    const exercise = new Exercise({
        username: req.body.username,
        description: req.body.description,
        duration: Number(req.body.duration),
        date: Date.parse(req.body.date),
        user: req.userId
    });

    exercise.save()
        .then(() => res.status(201).json({ message: 'New Exercise added successfully!', id: exercise.id }))
        .catch(error => res.status(400).json({ message: error }));
};

exports.getOne = (req, res) => {
    Exercise.findOne({ _id: req.params.id})
        .then(exercise => res.status(200).json(exercise))
        .catch(error => res.status(404).json({ message: error }));
};

exports.deleteOne = (req, res) => {
    Exercise.deleteOne({ _id: req.params.id })
        .then(() => res.status(204).send())
        .catch(error => res.status(400).json({ message: error }));
};

exports.updateOne = (req, res) => {
    Exercise.updateOne({ _id: req.params.id}, {
        description: req.body.description,
        duration: Number(req.body.duration),
        date: new Date(req.body.date)
    })
        .then(() => res.status(200).json({ message: 'Exercise updated!' }))
        .catch(error => res.status(400).json({ message: error }));
};