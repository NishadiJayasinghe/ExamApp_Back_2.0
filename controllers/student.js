'use strict';


var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var cors = require('cors')
var Student = require('../models/student');
var Subject = require('../models/subject');
var StudentController = require('../controllers/student');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var passwordValidator = require('password-validator');
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



// get student details
exports.getSubjects = function(req, res){
  console.log('getting the details')
  var query = Subject.find({'studentId': req.body.studentId});
  query.exec(function(err, subjects){
      if(err){
          console.log('error has occured', err);
          res.sendStatus(409);

      }else{
          if(subjects !== null){
              console.log('result is not null', subjects);
              res.json({message: 'succcess', content: subjects});
          }else{
              console.log('result is null');
              res.sendStatus(409);
          }

      }
  });
}  


// Student signIn/login

exports.studentLogin = function(req, res){
  console.log("##### student signIn ######");

  Student.findOne({indexNumber: req.body.indexNumber})
  .exec(function(err, student){
    if(err){
      console.log('###### error occured' + err);
      res.send('error');
    }else{
      if(student !== null){
        console.log("################# not an null data : student already exist ###########");
        if(bcrypt.compareSync(req.body.password, student.password)){
          student.password = undefined;
          res.json({ message: 'success', details: "Login successfuly", content: student, token: jwt.sign({ indexNumber: student.indexNumber,email: student.email, firstName: student.firstName, lastName: student.lastName, _id: student._id, faculty: student.faculty, department: student.department}, 'RESTFULAPIs')});
        }else{
          res.json({ message: 'failed', details: "Invalid password!", status: "signin_failed"});
        }
      }else{
        console.log("####################### null data ##########################");
        res.json({ message: 'failed', details: "index number not registered!", status: "signin_failed" });
      }
    }
  });
};




/* ### Change user password ### */
exports.updatePassword = function(req, res){
  console.log('###### updating password ######');
  Student.findById(req.body.studentId)
    .exec(function (err, student) {
      if (err) {
        console.log('error occured');
        console.log(err)
        res.json({ message: 'failed', details: "student does not exists", status: "student_not_exited" });
      }
      else {
        if (student !== null) {
          if (bcrypt.compareSync(req.body.oldPassword, student.password)) {

            var schema = new passwordValidator();
          schema
          .is().min(6)
          .is().max(8)
          .has().uppercase()
          .has().lowercase()
          .has().symbols()
          .has().digits()
          .has().not().spaces()

            if(schema == true){

            var newValues = {
              $set: {
                password: bcrypt.hashSync(req.body.newPassword, 8)
              }
            }
            Student.findByIdAndUpdate(req.body.studentId, newValues, function (err) {
              if (err) {
                console.log(err)
                throw err;
              } else {
                Student.findById(req.body.studentId)
                  .exec(function (err, students) {
                    if (err) {
                      console.log('error occured');
                      console.log(err)
                    } else {
                      res.json({ message: 'success', details: "user profile updated successfully", content: students });
                    }
                  });
                }
              });
          } else {
            res.json({ message: 'failed', details: "Current password doesn't matched!", status: "authentification_failed" });
          }
          }else{
            console.log('password is incorrect')
            res.json({message: 'failed', details: 'password is incorrect'})
          }
          } else {
            res.json({ message: 'failed', details: "User does not exists", status: "user_not_exited" });
          }
      }
    });
};


// ###.....................update student profile.......................###


exports.updateProfile = function(req, res){
  console.log('...........................updating the students profile.......................')
  Student.findById(req.body.studentId)
  .exec(function(err, students){
    if(err){
      consloe.log('error has occured', err);
      res.stauts(409)
      res.json({message:'error has occured user not registered ....................' })
    }else{
      if(students !== null){
        var newValues = {
          $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName, 
            faculty: req.body.faculty,
            department: req.body.department,
            contactNumber: req.body.contactNumber,
            stdRegNumber: req.body.stdRegNumber,
            indexNumber: req.body.indexNumber
            
          }
        }
        Student.findByIdAndUpdate(req.body.studentId, newValues, function(err){
          if(err){
            consle.log('error occured profile not updated successfully'. err);
            res.send(409)
            res.json({message: 'failed ', details: 'student profile not updated'})
            
          }else{
            Student.findById(req.body.studentId)
            .exec(function(err, result){
              if(err){
                console.log('.....................error occured......................');
                res.json({message: 'failed', details: 'student profile not updated successfully........'})
              }else{
                console.log(result);
                res.json({message: 'successfully updated the student profile', status: result})
              }
            })
          }
        })

        
      }
    }
  })

}

// ..............................subject submission.......................

exports.subjectSubmission = function(req,res){
  console.log('submitting the subjects');
  Student.findById(req.body.studentId)
  .exec(function(err, students){
    if(err){
      console.log('error has occured')
      throw err;

    }else{
      if(students !== null){
        console.log('...............student is not null good to go...............')
        var subjects = new Subject();
          subjects.studentId = req.body.studentId
          subjects.subject.subjectName1 = req.body.subjectName1
          subjects.subject.subjectName2 = req.body.subjectName2,
          subjects.subject.subjectName3 = req.body.subjectName3,
          subjects.subject.subjectName4 = req.body.subjectName4,
          subjects.subject.subjectName5 = req.body.subjectName5,
          subjects.subject.subjectName6 = req.body.subjectName6,
          subjects.subject.subjectName7 = req.body.subjectName7,
          subjects.subject.subjectName7 = req.body.subjectName7,
          subjects.subject.subjectName7 = req.body.subjectName7,
          subjects.subject.subjectName8 = req.body.subjectName8,
          subjects.subject.subjectName9 = req.body.subjectName9,
          subjects.subject.subjectName10 = req.body.subjectName10,
          subjects.subject.subjectName11 = req.body.subjectvName11,
          subjects.subject.subjectName12 = req.body.subjectName12,
          subjects.subject.subjectName13 = req.body.subjectName13

          subjects.save(function(err, result){
            if(err){
              console.log('error has occured')
              throw err,
              res.json({message: 'failed', details: 'subjects not successfully submitted'})
            }else{
              console.log('subjects successfully submitted ', result)
              res.json({message: 'successs', details: 'successfully submitted', content: result })
            }
          })
      }

    }
    
  })
}



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