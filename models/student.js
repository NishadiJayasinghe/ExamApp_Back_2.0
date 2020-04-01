var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var StudentSchema = Schema({
    firstName: { type: String, required: true, unique: false},
    lastName: { type: String, required: true, unique: false},
    faculty: { type: String, required: true, unique: false},
    department: { type: String, required: true, unique: false},
    stdRegNumber: { type: String, required: true, unique: true},
    indexNumber: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    contactNumber: { type: Number, required: true, unique: true},
    password: { type: String, required: true, unique: true}

});

module.exports = mongoose.model('Student', StudentSchema);

