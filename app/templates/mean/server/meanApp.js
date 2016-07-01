#!/bin/env node

var express         = require('express');
var http            = require('http');
var path            = require('path');
var morgan          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var mongoose        = require('mongoose');
var passport        = require('passport');
var flash           = require('connect-flash');
var session         = require('express-session');
var cors            = require('cors');

var secretKey		= "thisismysupersecret";

// Database
var configDB = require('./config/database.js');

mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration


var app = express();

//express setup
app.use(cors(
	{
	  "origin": "*",
	  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
	  "preflightContinue": false,
	  "credentials":true
	}
));
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser(secretKey)); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: false }));

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// required for passport
app.use(session({ secret:secretKey,
				resave: false,
				saveUninitialized: false,
				})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(express.static(path.join(__dirname, 'public') , { maxAge: 1800000 } ));

//socket io
//var io=require('./socket/socket.js')(app);

// routes setup
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.startApp=function(port,ipaddress,startedFunc){

	var server = require('http').Server(app);
	var io=require('./socket/socket.js')(server);

	server.listen(port, ipaddress, startedFunc);
}

module.exports = app;
