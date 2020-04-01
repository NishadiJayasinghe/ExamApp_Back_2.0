var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var AdminSchema = Schema({
    firstName: { type: String, required: true, unique: false},
    lastName: { type: String, required: true, unique: false},
    designation: { type: String, required: true, unique: false},
    department: { type: String, required: true, unique: false},
    adminRegNumber: { type: String, required: true, unique: false},
    email: { type: String, required: true, unique: false},
    contactNumber: { type: Number, required: true, unique: false},
    password: { type: String, required: true, unique: false}
});

module.exports = mongoose.model('Admin', AdminSchema);