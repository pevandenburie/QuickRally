var Train = require('./lib/train').Train,
    Trains = require('./lib/train').Trains,
    Team = require('./lib/team').Team,
    Teams = require('./lib/team').Teams,
    User = require('./lib/user').User,
    Users = require('./lib/user').Users,
    util = require('./lib/util');

var TakeATrain = function(options) {
  this.trains = new Trains(null, {options: options});
}


TakeATrain.prototype.start = function() {
  return this.trains.start();
}

TakeATrain.prototype.searchUser = function(nameToSearch) {
  return this.trains.searchUser(nameToSearch);
}

TakeATrain.prototype.searchTeam = function(nameToSearch) {
  return this.trains.searchTeam(nameToSearch);
}

TakeATrain.Train = Train;
TakeATrain.Trains = Trains;
TakeATrain.Team = Team;
TakeATrain.Teams = Teams;
TakeATrain.User = User;
TakeATrain.Users = Users;
TakeATrain.util = util;

module.exports = TakeATrain;
