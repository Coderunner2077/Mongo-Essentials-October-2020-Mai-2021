const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: String
});

roleSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

roleSchema.virtual("id").get(function() {
    return this.toObject()._id;
});

module.exports = mongoose.model("Role", roleSchema);