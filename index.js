'use strict';

// Override .babelrc
require("babel-register")({
  presets: ["node6", "react", "stage-1"],
  plugins: ["transform-decorators-legacy"]
});


var config = require('config.js');
var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = Promise;
var throttle = require('lodash.throttle');

var receivedSigInt = false;


// MAIN ROUTINE

function startServer(){
	var server = require('server.jsx');

  return Promise.try(() => {
		initTerminationHandlers();

    return startDatabase();
  })
  .then(() => server.listen(config.HTTP_PORT, function() {
			console.log((new Date()).toJSON() + " | " + config.APP_NAME + " listening on port " + config.HTTP_PORT)
		})
  );
}

// MONGODB START

function startDatabase(){
  if(!config.MONGODB_URI) return Promise.resolve();

  // Check that the server is listening
  return new Promise(function(resolve, reject){
    var net = require('net');
    var socket = new net.Socket();
    var mongoUri = require('url').parse(config.MONGODB_URI);

    var timeout = 4000;
    socket.setTimeout(timeout, function() {
      socket.destroy();
      reject();
    });
    socket.connect(mongoUri.port, mongoUri.hostname, function() {
      // THE PORT IS LISTENING
      socket.destroy();
      resolve();
    });
    socket.on('data', function() {
      socket.destroy();
      resolve();
    });
    socket.on('error', function(e) {
      console.error("-----");
      console.error("ERROR:\nThe MongoDB Server is not available");
      console.error(e.message || e);
      console.error("-----");
      reject();
      socket.destroy();

      process.exit(1);
    });
  })
  .then(function(){
    // MongoDB Event Handlers
    mongoose.connection.once('open', onDbConnectionOpen);
    mongoose.connection.on('connecting', onDbConnecting);
    mongoose.connection.on('error', onDbConnectionError);
    mongoose.connection.on('connected', onDbConnected);
    mongoose.connection.on('reconnected', onDbReconnected);
    mongoose.connection.on('disconnected', throttle(onDbDisconnected, 1000, {leading: true}));

    // Connect
    return mongoose.connect(config.MONGODB_URI); // , {server: {auto_reconnect:true}}
  });
}

// DB EVENT HANDLERS

function onDbConnecting() {
  console.log('%s | Connecting to the Database...', (new Date()).toJSON());
}
function onDbConnectionOpen() {
  console.log('%s | MongoDB connection opened', (new Date()).toJSON(), "\n");
}
function onDbConnectionError(error) {
  console.error('%s | Error on Database connection: ' + error, (new Date()).toJSON());
  mongoose.disconnect();
}
function onDbConnected() {
  console.log('%s | MongoDB connected', (new Date()).toJSON());
}
function onDbReconnected() {
  console.log('%s | MongoDB reconnected', (new Date()).toJSON(), "\n");
}
function onDbDisconnected() {
  console.error('%s | MongoDB disconnected', (new Date()).toJSON(), "\n");

  if(receivedSigInt) return;
  else mongoose.connect(config.MONGODB_URI); // , {server: {auto_reconnect:true}}
}

// SIGNAL HANDLERS

function initTerminationHandlers(){
  process.on('exit', terminator);

  var signals = [
    'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
    'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGTERM' //, 'SIGUSR2'
    // Removed 'SIGPIPE' from the list - bugz 852598.
  ];

  signals.forEach(signal => {
    switch(signal){
      case 'SIGINT':
        process.on(signal, () => {
          receivedSigInt = true;
          mongoose.disconnect().then(() => terminator(signal));
        })
        break;

      default: process.on(signal, () => terminator(signal) );
    }
  });
}

// TERMINATION HANDLER

function terminator(signal){
  if(!signal || typeof signal != "string")
    return console.log('%s | The app is terminating...', (new Date()).toJSON());

  mongoose.disconnect();
  console.error('%s | Received %s...', (new Date()).toJSON(), signal);
  process.exit(1);
}

// SERVER INIT

startServer()
.catch(err => {
  console.error("ERROR STARTING THE SERVER:", err);
})
