const mongoose = require('mongoose');
// require('mongoose-type-email');

const mailerSchema = mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    firstName: {type: String, required: true},
    surname: {type: String, required: true},
    midName: {type: String, required: true},
    mail: {type: String, required: true}
    // mail: {type: mongoose.SchemaTypes.Email, required: true}
});

module.exports = mongoose.model('Mailer', mailerSchema);