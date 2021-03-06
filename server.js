var express = require('express');
var app = express();
var port = process.env.PORT || 3000
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDb = require('./config/database.js');

// DB
mongoose.connect(configDb.url);

require('./config/passport')(passport);

//          EXPRESS
// Configure Express
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended : true }));

app.set('view engine', 'ejs');

// required for passport
app.use(session({ secret: 'secretmessage' }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login session
app.use(flash()); // use connect-flash for flash messaging stored in session

// routes ===============================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ===============================================================
app.listen(port);
console.log('The magic happens on port ' + port);
