var Flint = require('node-flint');
var webhook = require('node-flint/webhook');
var express = require('express');
var bodyParser = require('body-parser');

var trains = require('./takeatrain/models/train').trains;

var app = express();
app.use(bodyParser.json());

// flint options
var config = {
  webhookUrl: process.env.SPARK_WEBHOOKURL,
  token: process.env.SPARK_TOKEN,
  port: process.env.QUICKRALLY_PORT || 80,
};

//init flint
var flint = new Flint(config);
flint.start();

// init TakeATrain
trains.start();

// say hello
flint.hears('/hello', function(bot, trigger) {
  bot.say('Hello %s!', trigger.personDisplayName);
});

flint.hears('search', function(bot, trigger) {
  var noneFound =  {
    "name": "Not Found",
    "href": "/"
  };

  var nameToSearch = trigger.args[1];
  console.log("search for " + nameToSearch);

  //logger.info('action="search '+userObj.name+'"');
  var founds = trains.searchUser(nameToSearch);

  // no user found; look for a team
  if (founds.length === 0) {
    founds = trains.searchTeam(nameToSearch);
  }

  if (founds.length === 0) {
    founds.push(noneFound);
  }

  bot.say('I\'ve found:\n' + JSON.stringify(founds));

});

// default message for unrecognized commands
flint.hears(/.*/, function(bot, trigger) {
  bot.say('Could you please rephrase?');
}, 20);


// define express path for incoming webhooks
app.post('/flint', webhook(flint));

// start express server
var server = app.listen(config.port, function() {
  flint.debug('Flint listening on port %s', config.port);
});

server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  flint.debug('Listening on ' + bind);
}


// gracefully shutdown (crtl-c)
process.on('SIGINT', function() {
  flint.debug('stopping...');
  server.close();
  flint.stop().then(function() {
    process.exit();
  });
});
