let mongoose = require('mongoose')
let timestampPlugin = require('./plugins/timestamp')

let userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String
})

userSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName
});

userSchema.virtual('fullName').set(function(name) {
    let str = name.split(' ')

    if(str.length >= 1) {
        this.firstName = str[0]
        this.lastName = str[1]
    }
})

userSchema.methods.getInitials = function() {
    return this.firstName[0] + this.lastName[0]
}

userSchema.statics.getUsers() = function() {
    return new Promise((resolve, reject) => {
        this.find((err, docs) => {
            if(err) {
                console.error(err)
                return reject(err)
            }

            resolve(docs)
        })
    })
}

userSchema.plugin(timestampPlugin)

module.exports = mongoose.model('User', userSchema)