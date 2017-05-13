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
// Define markdown as default
flint.messageFormat = 'markdown';
flint.start();

// init TakeATrain
trains.start();

// say hello
flint.hears('hello', function(bot, trigger) {
  bot.say('Hello **'+trigger.personDisplayName+'**! Print **help** if you need some.');
});

flint.hears('help', function(bot, trigger) {
  bot.say('##I\'m QuickRally, the Infinite Home bot to help you interact with Rally!\n'+
          'You can ask me the following commands:\n'+
          '- **search <name>** will return the list of people matching \'name\'\n'+
          '- **help** will print this help');
});

var renderUser = function(user) {
  return '[**'+user.getDisplayName()+'**]('+user.getDirectoryLink()+') ('+user.getTeamName()+') : '+user.getRole();
}
exports.renderUser = renderUser;

var renderTeam = function(team) {
  var md = 'Team **"'+team.getName()+'"** :\n';
  var l = team.getUsers().length;
  for (var i=0; i<l; i++) {
    var user = team.getUsers()[i];
    md += '- [**'+user.getDisplayName()+'**]('+user.getDirectoryLink()+') : '+user.getRole()+'\n';
  }

  return md;
}
exports.renderTeam = renderTeam;


flint.hears('search', function(bot, trigger) {

  var nameToSearch = trigger.args[1];
  var response = '';

  console.log("search for " + nameToSearch);

  //logger.info('action="search '+userObj.name+'"');
  var usersFound = trains.searchUser(nameToSearch);

  for (var i=0; i<usersFound.length; i++) {
    console.log('found '+usersFound[i].user.getUsername());
    response += '- '+renderUser(usersFound[i].user) + '\n';
  }


/*
  var teamsFound = trains.searchTeam(nameToSearch);
  if (teamsFound.length !== 0) {
    for (var i=0; i<teamsFound.length; i++) {
      console.log('found '+teamsFound[i].getName());
      //response += renderTeam(teamsFound[i]) + '\n';
    }
  }
*/
  if (response === '') {
    response = 'Nothing found for: **'+nameToSearch+'** !';
  }
  console.log('response: '+response);
  bot.say(response);

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
