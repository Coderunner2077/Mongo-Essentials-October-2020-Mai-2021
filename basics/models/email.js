let mongoose = require('mongoose')
let validator = require('validator')
let timestampPlugin = require('./plugins/timestamp')

let emailSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true,
        unique: true,
        lowercase: true,
        validate: value => validator.isEmail(value)
    }
})

emailSchema.plugin(timestampPlugin)

module.exports = mongoose.model('Email', emailSchema)

/*
let mongoose = require('mongoose')

let emailSchema = new mongoose.Schema({
    email: String
})

module.exports = mongoose.model('Email', emailSchema)
*/