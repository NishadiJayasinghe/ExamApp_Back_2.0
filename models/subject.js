var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var SubjecetSchema = Schema({
    studentId: {type: String, required: true, unique: true},
    subject:{ type: String, required:true, unique:false}


});

module.exports = mongoose.model('Subject', SubjecetSchema);

