var logger = require('log4js').getLogger();
var Train = require('./train').Train,
    Team = require('./team').Team,
    User = require('./user').User,
    util = require('./util');

var mailer = util.mailer;

var TakeATrain = function() {
  this.trains = [];
}


TakeATrain.prototype.start = function() {
  var trainsCallback = createTrainsCallback(this.trains);

  restApi.get({
    ref: '/project/29404291867/Children',  // Infinite Home Feature Teams Children
  }).then(trainsCallback)
  .fail(function(errors) {
     logger.error(errors);
  });
}

TakeATrain.prototype.searchUser = function(lookingForUser) {
  var founds = [];

  lookingForUser = lookingForUser.toLowerCase();

  this.trains.forEach(function(train) {
    train.getTeams().forEach(function(team) {

      team.getUsers().forEach(function(user) {
        var current = user.getDisplayName();
        if (current.toLowerCase().indexOf(lookingForUser) != -1) {
          var found = {
            "name": current+ ' ('+team.getName()+')',
            "href": ('/trains/'+train.getName()+'#'+team.getName()),
            "user": user
          };
          founds.push(found);
        }
      });
    });
  });

  return founds;
}

TakeATrain.prototype.searchTeam = function(lookingForTeam) {
  var founds = [];

  lookingForTeam = lookingForTeam.toLowerCase();

  this.trains.forEach(function(train) {
    train.getTeams().forEach(function(team) {

      var current = team.getName();
      if (current.toLowerCase().indexOf(lookingForTeam) != -1) {
        var found = {
          "name": current + ' ('+train.getName()+')',
          "href": ('/trains/'+train.getName()+'#'+team.getName()),
          "team": team
        };
        founds.push(found);
      }
    });
  });

  return founds;
}



var rally = require('rally');
var restApi = rally({
    //user: 'paulvand', //required if no api key, defaults to process.env.RALLY_USERNAME
    //pass: '1234', //required if no api key, defaults to process.env.RALLY_PASSWORD
    //apiKey: '_GeUV8XARSxa9zLefh...', //preferred, required if no user/pass, defaults to process.env.RALLY_API_KEY
    //apiVersion: 'v2.0', //this is the default and may be omitted
    //server: 'https://rally1.rallydev.com',  //this is the default and may be omitted
    requestOptions: {
        headers: {
            'X-RallyIntegrationName': 'Take a Train',  //while optional, it is good practice to
            'X-RallyIntegrationVendor': 'Cisco',             //provide this header information
            'X-RallyIntegrationVersion': '1.0'
        }
        //any additional request options (proxy options, timeouts, etc.)
    }
});


function getUsernameFromEmail(email) {
  return email.split('@')[0];
}


function createTeamMembersCallback(team) {
  return function(result) {
    logger.info('action="TeamCallback", payloadFormat="json"'+', payload="'+JSON.stringify(result.Object)+'"');

    // Display each team member
    result.Object.Results.forEach(function(item) {
      logger.debug(item.DisplayName + ' (' + item.EmailAddress + ')' + (item.Disabled?' DISABLED':''));

      if (!item.Disabled) {
        // Append the user to the list
        var user = new User({
          DisplayName: item.DisplayName,
          EmailAddress: item.EmailAddress,
          Role: item.Role,
          username: getUsernameFromEmail(item.EmailAddress),
        });
        team.addUser(user);
      }
    });
  };
};

function createTeamMailerCallback(team) {
  return function(response) {
    logger.debug(JSON.stringify(response));
    team.setMailers(response);
  }
}

function createTeamsCallback(train) {
  return function(result) {
    logger.info('action="TeamsCallback", payloadFormat="json"'+', payload="'+JSON.stringify(result.Object)+'"');

    // Process the list of teams
    result.Object.Results.forEach(function(item) {
      logger.debug(item.Name + ' (' + item._ref + ')');

      // Append the team to the list
      var team = new Team({ Name: item.Name });
      train.addTeam(team);

      // Get mailer addresses for the team
      mailer.searchTeam(item.Name, createTeamMailerCallback(team));

      // Retrieve the Team members
      var teamMembersCallback = createTeamMembersCallback(team);
      restApi.get({
        ref: item.TeamMembers,
      }).then(teamMembersCallback)
      .fail(function(errors) {
         logger.error(errors);
      });

    });
  };
}

function createTrainCallback(trains) {
  return function(result) {
    logger.info('action="TrainCallback", payloadFormat="json"'+', payload="'+JSON.stringify(result.Object)+'"');

    logger.debug('-----Train--------');
    logger.debug(result.Object.Name + ' (' + result.Object._ref + ') ' + (result.Object.State==='Open'?'':result.Object.State));
    logger.debug('Description: ' + result.Object.Description);
    logger.debug('Notes: ' + result.Object.Notes);
    //logger.debug(result.Object.Name + ' (' + JSON.stringify(result.Object) + ')');
    logger.debug('------------------');

    if (result.Object.State==='Open') {
      // Append the train to the list
      var train = new Train({
        Name: result.Object.Name,
        Description: result.Object.Description,
        Notes: result.Object.Notes
      });
      trains.push( train );

      // Get mailer addresses for the train
      mailer.searchTrain(result.Object.Name, function(response) {
        logger.debug(JSON.stringify(response));
        //train.set('mailers', response);
        train.setMailers(response);
      });

      // Get list of teams
      var teamCallback = createTeamsCallback(train);
      restApi.get({
        ref: result.Object.Children,
      }).then(teamCallback)
      .fail(function(errors) {
         logger.error(errors);
      });
    }
  };
}


function createTrainsCallback(trains) {
  return function(result) {
    logger.info('action="TrainsCallback", payloadFormat="json"'+', payload="'+JSON.stringify(result.Object)+'"');

    // Process the list of trains
    result.Object.Results.forEach(function(item) {
      var trainCallback = createTrainCallback(trains);
      restApi.get({
          ref: item,
          //fetch: ['FormattedID', 'Name', 'Children', 'Description', 'Notes'], //fields to fetch
      }).then(trainCallback)
      .fail(function(errors) {
        logger.error(errors);
      });

    });
  };
}



TakeATrain.Train = Train;
TakeATrain.Team = Team;
TakeATrain.User = User;
TakeATrain.util = util;

module.exports = TakeATrain;
