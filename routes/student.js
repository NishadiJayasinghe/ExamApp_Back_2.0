'use strict'

var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var cors = require('cors');
var Student = require('../models/student');
var StudentController = require('../controllers/student');

app.use(cors);
router.use(cors())

//support on x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*
router.put('/changePassword', StudentController.changePassword);
router.put('/profileUpdate', StudentController.ProfileUpdate);
router.post('/loginreq', StudentController.loginRequired);
*/
router.get('/getSubjects', StudentController.loginRequired, StudentController.getSubjects)
router.post('/Studentlogin', StudentController.studentLogin);
router.post('/loginreq', StudentController.loginRequired);
router.put('/updatePassword', StudentController.loginRequired, StudentController.updatePassword);
router.put('/updateprofile', StudentController.loginRequired, StudentController.updateProfile);
router.post('/subjectSubmission', StudentController.loginRequired, StudentController.subjectSubmission)

module.exports = router;