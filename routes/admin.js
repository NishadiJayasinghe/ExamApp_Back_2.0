

const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin');


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