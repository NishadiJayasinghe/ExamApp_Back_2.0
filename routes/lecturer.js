

const express = require('express');
const  router = express.Router();
const LecturerController = require('../controllers/lecturer');

//router.post('/loginreq', LecturerController.loginRequired);
router.get('/getDetails', LecturerController.loginRequired, LecturerController.getDetails)
router.get('/getSubjects', LecturerController.loginRequired, LecturerController.getSubjects)
router.post('/Lecturerlogin', LecturerController.lecturerLogin);
router.put('/profileUpdate', LecturerController.loginRequired, LecturerController.ProfileUpdate);
router.put('/changePassword', LecturerController.loginRequired, LecturerController.updatePassword);

module.exports = router;