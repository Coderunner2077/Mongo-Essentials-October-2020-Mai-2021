const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const ROLES_MAP = {
    "607403f69543e104885f4f72": "User",
    "607403f69543e104885f4f73": "Moderator",
    "607403f69543e104885f4f74": "Admin"
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        select: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }
    ]
}, {
    timestamps: true
});

userSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    
    return object;
});

userSchema.virtual("id").get(function() {
    return this.toObject()._id;
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);