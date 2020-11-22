const mongoose = require('mongoose');

const trainingSchema = mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    nameT: {type: String, required: true},
    descrShort: {type: String, required: true},
    descrLong: {type: String, required: true}
});

module.exports = mongoose.model('Training', trainingSchema);