var Backbone = require('backbone');
var Users = require('./user').Users;

var Team = Backbone.Model.extend({
  defaults: {
    Name: 'NA',
    mailers: [],
    users: undefined,
  },
  initialize: function() {
    this.set('users', new Users());
  },
});


Team.prototype.getName = function() {
  return this.get('Name');
}

Team.prototype.getMailers = function() {
  return this.get('mailers');
}

Team.prototype.getUsers = function() {
  var users = [];
  this.get('users').forEach( function(user) {
    users.push(user);
  });
  return users;
}

Team.prototype.addUser = function(user) {
  this.get('users').add( user );
  user.setTeamName(this.getName());
}

Team.prototype.setTrainName = function(trainName) {
  this.trainName = trainName;
}

Team.prototype.getTrainName = function() {
  return this.trainName;
}

Team.prototype.fetchMailers = undefined;


var Teams = Backbone.Collection.extend({
  model: Team,
});

exports.Team = Team;
exports.Teams = Teams;
