var Users = require('./user').Users;

var Team = function(params) {
    this.Name = params.Name || 'NA';
    this.mailers = params.mailer || [];
    this.users = [];
};

Team.prototype.getName = function() {
  return this.Name;
}

Team.prototype.setMailers = function(mailers) {
  this.mailers = mailers;
}

Team.prototype.getMailers = function() {
  return this.mailers;
}

Team.prototype.getUsers = function() {
  return this.users;
}

Team.prototype.addUser = function(user) {
  this.users.push(user);
  user.setTeamName(this.Name);
}

Team.prototype.setTrainName = function(trainName) {
  this.trainName = trainName;
}

Team.prototype.getTrainName = function() {
  return this.trainName;
}


exports.Team = Team;
