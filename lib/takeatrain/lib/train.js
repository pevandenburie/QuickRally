var Team = require('./team').Team;
var User = require('./user').User;
var logger = require('log4js').getLogger();


var Train = function(params) {
  this.Name = params.Name || 'NA';
  this.Description = params.Description || '';
  this.Notes = params.Notes || '';
  this.mailers = [];
  this.teams = [];
}

Train.prototype.getName = function() {
  return this.Name;
}

Train.prototype.getDescription = function() {
  return this.Description;
}

Train.prototype.getNotes = function() {
  return this.Notes;
}

Train.prototype.setMailers = function(mailers) {
  this.mailers = mailers;
}

Train.prototype.getMailers = function() {
  return this.mailers;
}

Train.prototype.addTeam = function(team) {
  this.teams.push(team);
  team.setTrainName(this.Name);
}

Train.prototype.getTeams = function() {
  return this.teams;
}


exports.Train = Train;
