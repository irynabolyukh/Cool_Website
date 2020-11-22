const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    nameB: {type: String, required: true},
    authorB: {type: String, required: true}
});

module.exports = mongoose.model('Book', bookSchema);