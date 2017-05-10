var Backbone = require('backbone');
var Users = require('../models/user').Users;

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

var Teams = Backbone.Collection.extend({
  model: Team,
});

exports.Team = Team;
exports.Teams = Teams;
