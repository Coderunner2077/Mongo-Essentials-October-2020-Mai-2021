const database = require('./database')
const EmailModel = require('./email')
const UserModel = require('./user')

EmailModel
    .find({
        email: 'ada.lovelace@gmail.com'
    })
    .then(doc => {
        console.log(doc)
    })
    .catch(err => {
        console.error(err)
    });

EmailModel
    .findOneAndUpdate(
        {
            email: 'ada.lovelace.gmail.com' // search query
        },
        {
            email: 'ada.updated@gmail.com' // field: value to update
        },
        {
            new: true,            // return updated doc
            runValidators: true   // validate before update
        }
    )
    .then(doc => {
        console.log(doc)
    })
    .catch(err => {
        console.error(err)
    })

EmailModel
    .findOneAndRemove({
        email: 'ada.updated@gmail.com'
    })
    .then(response => {
        console.log(response)
    })
    .catch(err => {
        console.error(err)
    });

let model = new UserModel();

model.fullName = 'James Bond'

console.log(model.toJSON()) // Output model fields as JSON
console.log()
console.log(model.fullName) // Output the full name

let model2 = new UserModel({
    firstName: 'James',
    lastName: 'Jones'
});

let initials = model2.getInitials();

console.log('initials : ' + initials);

UserModel
    .getUsers()
    .then(docs => {
        console.log(docs)
    })
    .catch(err => {
        console.error(err)
    });

UserModel.find()                // find all users
    .skip(100)                  // skip first 100 records
    .limit(10)                  // limit to 10 records
    .sort({firstName: 1})       // sort ascending by firstName
    .select({firstName: true})  // select firstName only
    .exec()                     // execute the query
    .then(docs => {
        console.log(docs)
    })
    .catch(err => {
        console.error(err)
    })
