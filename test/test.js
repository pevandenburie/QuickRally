
var assert = require('assert');

var trains = require('../takeatrain/models/train').trains;
var Train = require('../takeatrain/models/train').Train;
var Team = require('../takeatrain/models/team').Team;
var User = require('../takeatrain/models/user').User;


describe('TakeATrain', function() {

  var user = undefined;

  before(function() {
    // Add a train, a team, a team member
    var train = new Train({
      Name: 'Indigo',
      Description: 'Test Train',
      Notes: 'Some notes about the Test Train'
    });

    var team = new Team({Name: 'The Avengers'});
    train.get('teams').add( team );

    // Append a user to the list
    user = new User({
      DisplayName: 'John Doe',
      EmailAddress: 'johndoe@test.com',
      Role: 'Tester',
      username: 'johndoe',
    });
    team.get('users').add( user );

    trains.add( train );
  });

  describe('User', function() {
    it('created user should be correctly filled', function() {
      assert.equal('John Doe', user.getDisplayName());
      assert.equal('johndoe@test.com', user.getEmailAddress());
      assert.equal('Tester', user.getRole());
      assert.equal('johndoe', user.getUsername());
    });
  });

  describe('#searchUser()', function() {
    it('should return empty array when user is unknown', function() {
      assert.equal(0, trains.searchUser('Unkown'));
    });
    it('should return one-element array when user is known', function() {
      var found = trains.searchUser('doe');
      assert.equal(1, found.length);
      assert.equal('John Doe (The Avengers)', found[0].name);
      assert.equal('/trains/Indigo#The Avengers', found[0].href);
    });
  });

  describe('#searchTeam()', function(){
    it('should return empty array when team is unknown', function() {
      assert.equal(0, trains.searchTeam('Unkown'));
    });
    it('should return one-element array when team is known', function() {
      var found = trains.searchTeam('avenger');
      assert.equal(1, found.length);
      assert.equal('The Avengers (Indigo)', found[0].name);
      assert.equal('/trains/Indigo#The Avengers', found[0].href);
    });
  });
});
