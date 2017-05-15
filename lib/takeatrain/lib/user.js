var Backbone = require('backbone');

var User = Backbone.Model.extend({
  defaults: {
    DisplayName: 'NA',
    username: '',
    EmailAddress: '',
    Role: '',
    teamName: ''  //value directly on the object
  }
});

User.prototype.getDisplayName = function() {
  return this.get('DisplayName');
}

User.prototype.getEmailAddress = function() {
  return this.get('EmailAddress');
}

User.prototype.getRole = function() {
  return this.get('Role');
}

User.prototype.getUsername = function() {
  return this.get('username');
}

User.prototype.getDirectoryLink = function() {
  return 'http://wwwin-tools.cisco.com/dir/'+this.get('username');
}

User.prototype.getPictureLink = function() {
  return 'http://wwwin.cisco.com/dir/photo/std/'+this.get('username')+'.jpg'
}

User.prototype.setTeamName = function(teamName) {
  this.teamName = teamName;
}

User.prototype.getTeamName = function() {
  return this.teamName;
}


var Users = Backbone.Collection.extend({
  model: User,
});

exports.User = User;
exports.Users = Users;
