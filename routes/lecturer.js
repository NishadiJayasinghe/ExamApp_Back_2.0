'use strict'

var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var cors = require('cors')
var Lecturer = require('../models/lecturer');
var LecturerController = require('../controllers/lecturer');

app.use(cors());
router.use(cors());

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




//router.post('/loginreq', LecturerController.loginRequired);
router.get('/getDetails', LecturerController.loginRequired, LecturerController.getDetails)
router.get('/getSubjects', LecturerController.loginRequired, LecturerController.getSubjects)
router.post('/Lecturerlogin', LecturerController.lecturerLogin);
router.put('/profileUpdate', LecturerController.loginRequired, LecturerController.ProfileUpdate);
router.put('/changePassword', LecturerController.loginRequired, LecturerController.updatePassword);

module.exports = router;