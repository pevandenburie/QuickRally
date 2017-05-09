var Backbone = require('backbone');

var User = Backbone.Model.extend({
  defaults: {
    DisplayName: 'NA',
    username: '',
    EmailAddress: '',
    Role: '',
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


var Users = Backbone.Collection.extend({
  model: User,
});

exports.User = User;
exports.Users = Users;
