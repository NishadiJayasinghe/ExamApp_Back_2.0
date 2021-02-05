var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var AdminAddSubject = Schema({

    year:{ type: String, required: true, unique: false},
    semester:{ type: String, required: true, unique: false},
    subjectName: {type:String, required: true, unique:false}
});

module.exports = mongoose.model('AdminAddSubject', AdminAddSubject);

