#!/bin/env node
//  OpenShift sample Node application
//var meanApp = require('meanApp');


/**
 *  Define the sample application.
 */
var ServerApp = function() {

    //  Scope.
    var self = this;

    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };
    
    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.app= require('./meanApp');
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        /*self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });*/
		
		self.app.startApp(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
		
		/*var express = require('express');
		var https = require('https');
		var http = require('http');
		var app = express();

		http.createServer(app).listen(80);
		https.createServer(options, app).listen(443);*/
		
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new ServerApp();
zapp.initialize();
zapp.start();

