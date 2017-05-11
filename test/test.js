
var assert = require('assert');

var trains = require('../takeatrain/models/train').trains;
var Train = require('../takeatrain/models/train').Train;
var Team = require('../takeatrain/models/team').Team;
var User = require('../takeatrain/models/user').User;

var renderUser = require('../app.js').renderUser;


describe('TakeATrain', function() {

  var user = undefined;
  var team = undefined;
  var train = undefined;

  before(function() {
    // Add a train, a team, a team member
    train = new Train({
      Name: 'Indigo',
      Description: 'Test Train',
      Notes: 'Some notes about the Test Train'
    });

    team = new Team({
      Name: 'The Avengers'
    });
    train.get('teams').add( team );

    // Append a user to the list
    user = new User({
      DisplayName: 'John Doe',
      EmailAddress: 'johndoe@test.com',
      Role: 'Tester',
      username: 'johndoe',
    });
    team.addUser(user);

    trains.add( train );
  });

  describe('User', function() {
    it('created User should be correctly filled', function() {
      assert.equal('John Doe', user.getDisplayName());
      assert.equal('johndoe@test.com', user.getEmailAddress());
      assert.equal('Tester', user.getRole());
      assert.equal('johndoe', user.getUsername());
      assert.equal('http://wwwin-tools.cisco.com/dir/johndoe', user.getDirectoryLink());
      assert.equal('http://wwwin.cisco.com/dir/photo/std/johndoe.jpg', user.getPictureLink());
      assert.equal('The Avengers', user.getTeamName());
    });
  });


  describe('Team', function() {
    it('created Team should be correctly filled', function() {
      assert.equal('The Avengers', team.getName());
      assert.ok(Array.isArray(team.getMailers()));
      assert.equal(0, team.getMailers().length);
      assert.equal(1, team.getUsers().length);
      assert.equal('johndoe', team.getUsers()[0].getUsername());
    });
  });

  describe('Train', function() {
    it('created Train should be correctly filled', function() {
      assert.equal('Indigo', train.getName());
      assert.equal('Test Train', train.getDescription());
      assert.equal('Some notes about the Test Train', train.getNotes());
      assert.equal(0, train.getMailers().length);
      assert.equal(1, train.getTeams().length);
      assert.equal('The Avengers', train.getTeams()[0].getName());
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

      assert.equal('John Doe', found[0].user.getDisplayName());
      assert.equal('johndoe@test.com', found[0].user.getEmailAddress());
      assert.equal('Tester', found[0].user.getRole());
      assert.equal('johndoe', found[0].user.getUsername());
    });
  });

  describe('#searchTeam()', function() {
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


  describe('Markdown Rendering', function() {
    it('User rendering should provide a correct Markdown', function() {
      /*var rendering = '[**John Doe**](http://wwwin-tools.cisco.com/dir/johndoe) (The Avengers) '+
                      '![johndoe](http://wwwin.cisco.com/dir/photo/std/johndoe.jpg)';*/
      var rendering = '[**John Doe**](http://wwwin-tools.cisco.com/dir/johndoe) (The Avengers)';
      assert.equal(rendering, renderUser(user));
    });
  });

  // describe('Mailer', function() {
  //   it('created Team should call the provided fetchMailers() function', function() {
  //     Team.prototype.fetchMailers = function() {
  //       this.mailers.push("")
  //     }
  //
  //     var team = new Team({ Name: "x-mens" });
  //     assert.equal(2, team.getMailers().length);
  //   });
  // });
});
