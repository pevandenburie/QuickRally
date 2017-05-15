

var User = function(params) {
  this.DisplayName = params.DisplayName || 'NA',
  this.username = params.username || '',
  this.EmailAddress = params.EmailAddress || '',
  this.Role = params.Role || '',
  this.teamName = params.teamName || ''
}

User.prototype.getDisplayName = function() {
  return this.DisplayName;
}

User.prototype.getEmailAddress = function() {
  return this.EmailAddress;
}

User.prototype.getRole = function() {
  return this.Role;
}

User.prototype.getUsername = function() {
  return this.username;
}

User.prototype.getDirectoryLink = function() {
  return 'http://wwwin-tools.cisco.com/dir/'+this.username;
}

User.prototype.getDirectoryPictureLink = function() {
  return 'http://wwwin.cisco.com/dir/photo/std/'+this.username+'.jpg'
}

User.prototype.setTeamName = function(teamName) {
  this.teamName = teamName;
}

User.prototype.getTeamName = function() {
  return this.teamName;
}


exports.User = User;
