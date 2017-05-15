var Backbone = require('backbone');
var Users = require('./user').Users;

var Team = Backbone.Model.extend({
  defaults: {
    Name: 'NA',
    mailers: []
  },
  initialize: function() {
    this.users = [];
  },
});


Team.prototype.getName = function() {
  return this.get('Name');
}

Team.prototype.getMailers = function() {
  return this.get('mailers');
}

Team.prototype.getUsers = function() {
  return this.users;
}

Team.prototype.addUser = function(user) {
  this.users.push(user);
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
