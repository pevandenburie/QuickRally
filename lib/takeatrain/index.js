var Train = require('./lib/train').Train,
    Trains = require('./lib/train').Trains,
    Team = require('./lib/team').Team,
    Teams = require('./lib/team').Teams,
    User = require('./lib/user').User,
    Users = require('./lib/user').Users,
    util = require('./lib/util');

var TakeATrain = function() {
  this.trains = new Trains();
}


TakeATrain.prototype.start = function() {
  this.trains.start();
}


TakeATrain.Train = Train;
TakeATrain.Trains = Trains;
TakeATrain.Team = Team;
TakeATrain.Teams = Teams;
TakeATrain.User = User;
TakeATrain.Users = Users;
TakeATrain.util = util;

module.exports = TakeATrain;

// function restApi(options) {
//     return new RestApi(options);
// }
//
// restApi.RestApi = RestApi;
// restApi.util = util;
//
// restApi.debug = process.env.NODE_DEBUG && /rally/.test(process.env.NODE_DEBUG);
//
// module.exports = restApi;
