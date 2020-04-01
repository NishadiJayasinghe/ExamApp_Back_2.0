'use strict'

var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var cors = require('cors');
var Admin = require('../models/admin');
var AdminController = require('../controllers/admin');
app.use(cors())
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
router.put('/changePassword', AdminController.changePassword);
router.put('/profileUpdate', AdminController.ProfileUpdate);
router.post('/loginreq', AdminController.loginRequired);
*/
router.get('/getStudentSubjects', AdminController.loginRequired, AdminController.getSubjects)
router.get('/getLecturerDetails', AdminController.loginRequired, AdminController.getDetails)

router.post('/studentSignup', AdminController.studentSignup);
router.post('/lecturerSignup', AdminController.lecturerSignup);
router.post('/adminLogin', AdminController.adminLogin);
router.post('/addSubjects', AdminController.loginRequired, AdminController.addSubjects);

router.put('/updateSubjects', AdminController.loginRequired, AdminController.updateSubject);

router.delete('/deleteSubject', AdminController.loginRequired, AdminController.deleteSubject)
router.delete('/deleteStudent', AdminController.loginRequired, AdminController.deleteStudent);
router.delete('/deleteLecturer', AdminController.loginRequired, AdminController.deleteLecturer);
router.delete('/deleteAdmin', AdminController.loginRequired, AdminController.deleteAdmin);

module.exports = router;