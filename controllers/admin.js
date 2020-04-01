'use strict';


var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var cors = require('cors')
var Student = require('../models/student');
var Admin = require('../models/admin');
var Lecturer = require('../models/lecturer');
var AdminController = require('../controllers/admin');
var AddAdminSubjects = require('../models/adminAddSubjects')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var passwordValidator = require('password-validator');
//var cryptoHandler = ('../controllers/cryptoHandler');
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










//Student sign Up

exports.studentSignup = function(req, res){
    console.log('############ Student Register ###############');
    Student.findOne({indexNumber : req.body.indexNumber} && {email: req.body.email})
    .exec(function(err, students){
      if(err){
        console.log('#### error occured #######' +err);
        res.send('error');
      }else{
        if(students !== null){
          console.log("########### not an null data : student already exist ######");
          res.json({ message: 'failed', details: "index number or email already registered!", status: "signup_failed"});
        }else{

          //.............................................validate password..........................................................
          var schema = new passwordValidator();
          schema
          .is().min(6)
          .is().max(8)
          .has().uppercase()
          .has().lowercase()
          .has().symbols()
          .has().digits()
          .has().not().spaces()


          console.log("########### null data #######################");
          var student = new Student();
          student.firstName = req.body.firstName;
          student.lastName = req.body.lastName;
          student.faculty = req.body.faculty;
          student.department = req.body.department;
          student.stdRegNumber = req.body.stdRegNumber;
          student.indexNumber = req.body.indexNumber;
          student.email = req.body.email;
          student.contactNumber = req.body.contactNumber;

           var legalPassword =  schema.validate(req.body.password);
           if(legalPassword == true){
            student.password = bcrypt.hashSync(req.body.password, 8);
               console.log('password entered successfully')
               res.status(201);
           }else{
             console.log('password is not validated')
             res.status(409)
             res.json({message: 'failed', details: 'PASSWORD IS INCORRECT'})
           }
          

          student.save(function(err){
          if(err){
            console.log('########### error occured ###############')
            console.log(err);
            res.send(err);
          }else{
            student.password = undefined;
            res.json({message: 'success', details: "SignUp successfully", content: student});
            console.log("succesfully signed up ")
          }
        });
        }
      }
    }
    )
}


// ### Change student password ### 
/*
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
            var newValues = {
              $set: {
                password: bcrypt.hashSync(req.body.newPassword, 10)
              }
            }
            Student.findByIdAndUpdate(req.body.userId, newValues, function (err) {
              if (err) {
                console.log(err)
                throw err;
              } else {
                Student.findById(req.body.studentId)
                  .exec(function (err, result) {
                    if (err) {
                      console.log('error occured');
                      console.log(err)
                    } else {
                      console.log(result)
                      res.json({ message: 'success', details: "user profile updated successfully", content: result });
                    }
                  });
                }
              });
          } else {
            res.json({ message: 'failed', details: "Current password doesn't matched!", status: "authentification_failed" });
          }

          } else {
            res.json({ message: 'failed', details: "student does not exists", status: "student_not_exited" });
          }
      }
    });
};
*/







//...........................delete student........................

exports.deleteStudent = function(req, res){

  console.log('deleting the student')
  Student.findById(req.body.studentId, function(err, students){
    if(err){
      console.log('error has occured...............')
      throw err
    }else{
      if(students !== null){
        console.log('student exists');

        Student.findByIdAndRemove(req.body.studentId, function(err){
          if(err){
            console.log('error has ocured................ student cant be deleted')
            res.json({ message: 'failed', details: 'student cant be deleted'})
          }else{
            Student.findById(req.body.studentId, function(err, result){
              if (err){
                console.log('student is not null still there. not deleted')
                res.status(409)
                res.json({message: 'FAILED',  detailS: 'student not deleted'})
              }else{
                console.log('student successfully deleted')
                res.json({message: 'success', status: result})
              }
            })
          }
        })

      }else{
        console.log('student null student hasnt registered check the user')
      }
    }
  })

}


//Admin SignIn/Login

exports.adminLogin = function(req, res){
  console.log("##### admin signIn ######");

  Admin.findOne({adminRegNumber: req.body.adminRegNumber})
  .exec(function(err, admin){
    if(err){
      console.log('###### error occured' + err);
      res.send('error');
    }else{
      if(admin !== null){
        console.log("################# not an null data : admin already exist ###########");
        if(bcrypt.compareSync(req.body.password, admin.password)){
          admin.password = undefined;
          res.json({ message: 'success', details: "Login successfuly", content: admin, token: jwt.sign({ email: admin.email, firstName: admin.firstName, lastName: admin.lastName, _id: admin._id, designation: admin.designation, department: admin.department}, 'RESTFULAPIs')});
        }else{
          res.json({ message: 'failed', details: "Invalid password!", status: "signin_failed"});
        }
      }else{
        console.log("####################### null data ##########################");
        res.json({ message: 'failed', details: "adminRegNumber not registered!", status: "signin_failed" });
      }
    }
  });
}; 


//...........................delete admin........................

exports.deleteAdmin = function(req, res){

  console.log('deleting the admin')
  Admin.findById(req.body.adminId, function(err, admins){
    if(err){
      console.log('error has occured...............')
      throw err
    }else{
      if(admins !== null){
        console.log('admin exists');

        Admin.findByIdAndRemove(req.body.adminId, function(err){
          if(err){
            console.log('error has ocured................ admin cant be deleted')
            res.json({ message: 'failed', details: 'admin cant be deleted'})
          }else{
            Admin.findById(req.body.adminId, function(err, result){
              if (err){
                console.log('admin is not null still there. not deleted')
                res.status(409)
                res.json({message: 'FAILED',  detailS: 'admin not deleted'})
              }else{
                console.log('admin successfully deleted')
                res.json({message: 'success', status: result})
              }
            })
          }
        })

      }else{
        console.log('admin null admin hasnt registered check the user')
      }
    }
  })

}



//Lecturer sign Up

exports.lecturerSignup = function(req, res){
    console.log('############Lecturer Register###############');
    Lecturer.findOne({email : req.body.email} && {lecRegNumber: req.body.lecRegNumber})
    .exec(function(err, lecturers){
      if(err){
        console.log('####error occured' + err);
        res.send('error');
      }else{
        if(lecturers !== null){
          console.log("########### not an null data : lecturer already exist ######");
          res.json({ message: 'failed', details: "email or regiter Number already registered!", status: "signup_failed"});
        }else{

          //.............................................validate password..........................................................
          var schema = new passwordValidator();
          schema
          .is().min(6)
          .is().max(12)
          .has().uppercase()
          .has().lowercase()
          .has().symbols()
          .has().digits()
          .has().not().spaces()

          console.log("########### null data #######################");
          var lecturer = new Lecturer();
          lecturer.firstName = req.body.firstName;
          lecturer.lastName = req.body.lastName;
          lecturer.designation = req.body.designation;
          lecturer.department = req.body.department;
          lecturer.lecRegNumber = req.body.lecRegNumber;
          lecturer.email = req.body.email;
          lecturer.contactNumber = req.body.contactNumber;
          lecturer.faculty = req.body.faculty;
          
          var legalPassword =  schema.validate(req.body.password);
          if(legalPassword == true){
            lecturer.password = bcrypt.hashSync(req.body.password, 12);
              console.log('password entered successfully')
              res.status(201);
          }else{
            console.log('password is not validated')
            res.status(409)
            res.json({message: 'failed', details: 'PASSWORD IS INCORRECT'})
          }
          

         lecturer.save(function(err){
         if(err){
           console.log('########### error occured ###############')
           console.log(err);
           res.send(err);
         }else{
          lecturer.password = undefined;
           res.json({message: 'success', details: "SignUp successfully", content: lecturer});
           console.log("succesfully signed up ")
         }
       });
       }
     }
   }
   )
}





//...........................delete lecturer........................

exports.deleteLecturer = function(req, res){

  console.log('deleting the student')
  Lecturer.findById(req.body.lecturerId, function(err, lecturer){
    if(err){
      console.log('error has occured...............')
      throw err
    }else{
      if(lecturer !== null){
        console.log('lecturer exists');

        Lecturer.findByIdAndRemove(req.body.lecturerId, function(err){
          if(err){
            console.log('error has ocured................ lecturer cant be deleted')
            res.json({ message: 'failed', details: 'lecturer cant be deleted'})
          }else{
            Lecturer.findById(req.body.lecturerId, function(err, result){
              if (err){
                console.log('lecturer is not null still there. not deleted')
                res.status(409)
                res.json({message: 'FAILED',  detailS: 'lecturer not deleted'})
              }else{
                console.log('lecturer successfully deleted')
                res.json({message: 'success', status: result})
              }
            })
          }
        })

      }else{
        console.log('lecturer null. lecturer hasnt registered check the lecturer')
      }
    }
  })

}


// admin add subjects

exports.addSubjects = function(req, res){
  console.log('adding the subjects')
  AddAdminSubjects.findOne({year: req.body.year} && {semester: req.body.semester})
  .exec(function(err, results){
    if(err){
      console.log('error has occured')
      throw err,
      res.status(409);
    }else{
      if(results !== null){
        console.log('error has occured, subjects already added')
        res.json({message: 'FAILED', details: 'subjects of this semester and year already been added '})
        throw err
      }else{
        console.log('null data subjects not been added by the admin')
        var addSubjects = new AddAdminSubjects();
        addSubjects.year = req.body.year,
        addSubjects.semester = req.body.semester,
        addSubjects.subject.subjectName1 = req.body.subjects1,
        addSubjects.subject.subjectName2 = req.body.subjects2,
        addSubjects.subject.subjectName3 = req.body.subjects3,
        addSubjects.subject.subjectName4 = req.body.subjects4,
        addSubjects.subject.subjectName5 = req.body.subjects5,
        addSubjects.subject.subjectName6 = req.body.subjects6,
        addSubjects.subject.subjectName7 = req.body.subjects7,
        addSubjects.subject.subjectName8 = req.body.subjects8,
        addSubjects.subject.subjectName9 = req.body.subjects9,
        addSubjects.subject.subjectName10 = req.body.subjects10,
        addSubjects.subject.subjectName11 = req.body.subjects11,
        addSubjects.subject.subjectName12 = req.body.subjects12,
        addSubjects.subject.subjectName13 = req.body.subjects13

        addSubjects.save(function(err, result){
          if(err){
            console.log('error has occured')
            throw err, 
            res.json({message: 'failed', details: ' subjects not been saved'});

          }else{
                 console.log(result)
                 res.json({message: 'success', details: 'successfully added the subjects', status: result})
               }
          
        })

      }


    }
  })
}

// .................................................update subjects..................................................

exports.updateSubject = function(req, res){
  console.log('updating the subject');

  AddAdminSubjects.findById(req.body.addSubjectId)
  .exec(function(err){
    if(err){
      console.log('error has occured. there is no such a subject recorded')
      res.status(409)
      res.json({message: 'failed', details: 'no such subject recorded'});
    }else{
     // subjectName =[subjectName1, subjectName2, subjectName3, subjectName3, subjectName4, subjectName5, subjectName6, subjectName7, subjectName8, subjectName9, subjects10, subjects11, subjects12, subjects13]
     
     AddAdminSubjects.findOne({'oldSubjectName': req.body.oldSubjectName})
     .exec(function(err, results){
       if(err){
         console.log('error')
         res.send(err)

       } else{
         if(results !== null){
           var newValues = {
        
          $set: {
          subjectName: req.body.newSubjectName
         }
      }
      AddAdminSubjects.findByIdAndUpdate(req.body.addSubjectId, newValues, function(err){
        if(err){
          console.log('error has occured')
          throw err,
          res.status(409),
          res.json({message: 'failed', details: 'subject hasnt been updated'});
        }else{
          AddAdminSubjects.findById(req.body.addSubjectId, function(err, value){
            if(err){
              console.log('error has occured')
              res.status(409)
              res.json({message: 'FAILED', details: 'subjects not been saved'})
            }else{
              console.log('successfully updated the subjects')
              res.json({message: 'SUCCESS', status: value})
            }
          })
        }
      
      })
    }
    }
    
    }) 
    }
  
  
  })
}


// delete the subject


exports.deleteSubject = function(req, res){

  console.log('deleting the student')
  AddAdminSubjects.findById(req.body.addSubjectId, function(err, subjects){
    if(err){
      console.log('error has occured...............')
      throw err
    }else{
      if(subjects !== null){
        console.log('lecturer exists');

        AddAdminSubjects.findByIdAndRemove(req.body.addSubjectId, function(err){
          if(err){
            console.log('error has ocured................ subject cant be deleted')
            res.json({ message: 'failed', details: 'subject cant be deleted'})
          }else{
            AddAdminSubjects.findById(req.body.addSubjectId, function(err, result){
              if (err){
                console.log('subject is not null still there. not deleted')
                res.status(409)
                res.json({message: 'FAILED',  detailS: 'subject not deleted'})
              }else{
                console.log('subject successfully deleted')
                res.json({message: 'success', status: result})
              }
            })
          }
        })

      }else{
        console.log('subject null. subject hasnt registered check the subject')
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