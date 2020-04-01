var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var AdminAddSubject = Schema({

    year:{ type: String, required: true, unique: false},
    semester:{ type: String, required: true, unique: false},
    subject:{
        subjectName1: {type: String, required: true, unique: false},
        subjectName2: {type: String, required: true, unique: false},
        subjectName3: {type: String, required: true, unique: false},
        subjectName4: {type: String, required: true, unique: false},
        subjectName5: {type: String, required: true, unique: false},
        subjectName6: {type: String, required: true, unique: false},
        subjectName7: {type: String, required: false, unique: false},
        subjectName8: {type: String, required: false, unique: false},
        subjectName9: {type: String, required: false, unique: false},
        subjectName10: {type: String, required: false, unique: false},
        subjectName11: {type: String, required: false, unique: false},
        subjectName12: {type: String, required: false, unique: false},
        subjectName13: {type: String, required: false, unique: false}
    
}
});

module.exports = mongoose.model('AdminAddSubject', AdminAddSubject);

