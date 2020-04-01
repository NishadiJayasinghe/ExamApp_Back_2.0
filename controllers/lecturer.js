'use strict';


var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var cors = require('cors');
var Lecturer = require('../models/lecturer');
var Subject = require('../models/subject');
var LecturerController = require('../controllers/lecturer');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var cryptoHandler = ('../controllers/cryptoHandler');
app.use(cors())
router.use(cors())
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var jsonwebtoken = require('jsonwebtoken');

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


// get lecture details

exports.getDetails = function(req, res){
  console.log('getting the details')
  var query = Subject.find({'lectureId': req.body.lectureId});
  query.exec(function(err, details){
      if(err){
          console.log('error has occured', err);
          res.sendStatus(409);

      }else{
          if(details !== null){
              console.log('result is not null', details);
              res.json({message: 'succcess', content: details});
          }else{
              console.log('result is null');
              res.sendStatus(409);
          }

      }
  });
}  


// view submitted subjects

exports.getSubjects = function(req, res){
  console.log('getting the submitted subjects')
  Subject.findById({subjectId: req.body.subjectId})
  .exec(function(err, result){
    if(err){
      console.log( 'error has occured')
      res.send(err)
      throw err
    }else{
      if(result !== null){
        Subject.find({ 'subjectName': req.body.subjectName})
        .exec(function(err, results){
          if(err){
            console.log('error has occured')
            throw err,
            res.json({message: 'FAILED', details: 'error has occured there is no such image'})

          }else{
            console.log('success', results);
            res.json({message: 'success', details: 'success you got the details', content: results})
          }
        })
      }
    }
  }) 
}






// Lecturer signin/login

exports.lecturerLogin = function(req, res){
  console.log("##### lecturer signIn ######");

  Lecturer.findOne({lecRegNumber : req.body.lecRegNumber})
  .exec(function(err, lecturer){
    if(err){
      console.log('###### error occured' + err);
      res.send('error');
    }else{
      if(lecturer !==null){
        console.log("################# not an null data : lecturer already exist ###########");
        if(bcrypt.compareSync(req.body.password, lecturer.password)){
          lecturer.password = undefined;
          res.json({ message: 'success', details: "Login successfuly", content: lecturer, token: jwt.sign({ email: lecturer.email, firstName: lecturer.firstName, lastName: lecturer.lastName, _id: lecturer._id}, 'RESTFULAPIs')});
        }else{
          res.json({ message: 'failed', details: "Invalid password!", status: "signin_failed"});
        }
      }else{
        console.log("####################### null data ##########################");
        res.json({ message: 'failed', details: "lecRegNumber not registered!", status: "signin_failed" });
      }
    }
  });
}; 

// ..........................profile update........................

exports.ProfileUpdate = function(req, res){
  console.log('updating the profile')
  Lecturer.findById(req.body.lecturerId, function(err, lecturers){
    if(err){
      console.log('error has occured........... lecturer not registered')
      throw err
    }else{
      if(lecturers !== null){
        console.log('lecture not null lecturer exist')

        var newValues = {
          $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            designation: req.body.designation,
            faculty: req.body.faculty,
            department: req.body.department,
            contactNumber: req.body.contactNumber,
            lecRegNumber: req.body.lecRegNumber
            
            
          }
        }
        Lecturer.findByIdAndUpdate(req.body.lecturerId, newValues, function(err){
          if(err){
            console.log('error has occured')
            throw err,
            res.json({message: 'failed', details: 'profile update failed'});
          }else{
            Lecturer.findById(req.body.lecturerId, function(err, results){
              if(err){
                console.log('error occured lecturer profile not updated')
                res.json({message: 'failed', details: 'lecturer profile not updated'})
              }else{
                console.log('lecturer profile successfully updated')
                console.log(results)
                res.json({message: 'success', details: 'successfully updated', status: results})
              }
            })
          }
        })
      }
    }
  })
}


// .......................password change...........................

// ### Change student password ### 

exports.updatePassword = function(req, res){
  console.log('###### updating password ######');
  Lecturer.findById(req.body.lecturerId)
    .exec(function (err, lecturer) {
      if (err) {
        console.log('error occured');
        console.log(err)
        res.json({ message: 'failed', details: "lecturer does not exists", status: "lecturer_not_exited" });
      }
      else {
        if (lecturer !== null) {
          if (bcrypt.compareSync(req.body.oldPassword, lecturer.password)) {
            var newValues = {
              $set: {
                password: bcrypt.hashSync(req.body.newPassword, 10)
              }
            }
            Lecturer.findByIdAndUpdate(req.body.lecturerId, newValues, function (err) {
              if (err) {
                console.log(err)
                throw err;
              } else {
                Lecturer.findById(req.body.lecturerId)
                  .exec(function (err, lecturer) {
                    if (err) {
                      console.log('error occured');
                      console.log(err)
                    } else {
                      console.log(lecturer)
                      res.json({ message: 'success', details: "lecturer profile updated successfully", content: lecturer });
                    }
                  });
                }
              });
          } else {
            res.json({ message: 'failed', details: "Current password doesn't matched!", status: "authentification_failed" });
          }

          } else {
            res.json({ message: 'failed', details: "student does not exists", status: "user_not_exited" });
          }
      }
    });
};






// .......................login required............................
exports.loginRequired = function(req, res, next){
  console.log("###### login required ######");
  console.log(req.headers)
  if(req.student){
    next()
  } else {
    return res.status(401).json({ message: 'Unauthorized user!' });
     
  }
}