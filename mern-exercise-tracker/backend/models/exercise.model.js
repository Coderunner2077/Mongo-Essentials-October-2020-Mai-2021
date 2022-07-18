const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    username: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
    { timestamps: true }
);

exerciseSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

exerciseSchema.virtual("id").get(function() {
    return this.toObject()._id;
});

module.exports = mongoose.model('Exercise', exerciseSchema);