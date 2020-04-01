var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var jsonwebtoken = require('jsonwebtoken');


//routers
//var index = require('./routes/index');
var student = require('./routes/student');
var lecturer = require('./routes/lecturer');
var admin = require('./routes/admin');


var cors = require('cors');
app.use(express.static('/public'));
app.use(cors());
app.use('/public', express.static('/public'));


//connect to db
var portSelected = 8080;
var dbe = 'mongodb://localhost/examApp';
  app.listen(portSelected, function(){
    console.log('Database connected. Exam Application listening to port ' + portSelected)
  });
mongoose.connect(dbe);

//app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Token middleware
app.use(function(req, res, next){
  if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode){
      if(err) req.student = undefined;
      req.student = decode;
      next();
    });
  } else {
    req.student = undefined;
    next();
  }
});




// routes

//app.use('/', index);
app.use('/student', student);
app.use('/lecturer', lecturer);
app.use('/admin', admin);



app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
  res.json({ error: err });
});

module.exports = app;



/*
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNoYXJ1QGdhbWlsLmNvbSIsImZpcnN0TmFtZSI6ImNoYXJ1IiwibGFzdE5hbWUiOiJ1bWVzaCIsIl9pZCI6IjVkZDhhMmUxOTJhYmM0N2ZmMmM4ZmY1NiIsImlhdCI6MTU3NDQ3ODc3NH0.w2epbHckDFXD14MMZUaz-BNZ4irjgRcM-C04faDxLGI
*/