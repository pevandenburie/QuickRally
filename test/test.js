
var assert = require('assert');

var trains = require('../takeatrain/models/train').trains;
var Train = require('../takeatrain/models/train').Train;
var Team = require('../takeatrain/models/team').Team;
var User = require('../takeatrain/models/user').User;

var renderUser = require('../app.js').renderUser;
var renderTeam = require('../app.js').renderTeam;


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
      Role: 'Super Hero',
      username: 'johndoe',
    });
    team.addUser(user);

    team.addUser(new User({
        DisplayName: 'Iron Man',
        EmailAddress: 'ironman@test.com',
        Role: 'Super Hero',
        username: 'ironman',
    }));

    trains.add( train );
  });

  describe('User', function() {
    it('created User should be correctly filled', function() {
      assert.equal(user.getDisplayName(), 'John Doe');
      assert.equal(user.getEmailAddress(), 'johndoe@test.com');
      assert.equal(user.getRole(), 'Super Hero');
      assert.equal(user.getUsername(), 'johndoe');
      assert.equal(user.getDirectoryLink(), 'http://wwwin-tools.cisco.com/dir/johndoe');
      assert.equal(user.getPictureLink(), 'http://wwwin.cisco.com/dir/photo/std/johndoe.jpg');
      assert.equal(user.getTeamName(), 'The Avengers');
    });
  });


  describe('Team', function() {
    it('created Team should be correctly filled', function() {
      assert.equal(team.getName(), 'The Avengers');
      assert.ok(Array.isArray(team.getMailers()));
      assert.equal(team.getMailers().length, 0);
      assert.equal(team.getUsers().length, 2);
      assert.equal(team.getUsers()[0].getUsername(), 'johndoe');
      assert.equal(team.getUsers()[1].getUsername(), 'ironman');
    });
  });

  describe('Train', function() {
    it('created Train should be correctly filled', function() {
      assert.equal(train.getName(), 'Indigo');
      assert.equal(train.getDescription(), 'Test Train');
      assert.equal(train.getNotes(), 'Some notes about the Test Train');
      assert.equal(train.getMailers().length, 0);
      assert.equal(train.getTeams().length, 1);
      assert.equal(train.getTeams()[0].getName(), 'The Avengers');
    });
  });


  describe('#searchUser()', function() {
    it('should return empty array when user is unknown', function() {
      assert.equal(trains.searchUser('Unkown'), 0);
    });
    it('should return one-element array when user is known', function() {
      var found = trains.searchUser('doe');
      assert.equal(found.length, 1);
      assert.equal(found[0].name, 'John Doe (The Avengers)');
      assert.equal(found[0].href, '/trains/Indigo#The Avengers');

      assert.equal(found[0].user.getDisplayName(), 'John Doe');
      assert.equal(found[0].user.getEmailAddress(), 'johndoe@test.com');
      assert.equal(found[0].user.getRole(), 'Super Hero');
      assert.equal(found[0].user.getUsername(), 'johndoe');
    });
  });

  describe('#searchTeam()', function() {
    it('should return empty array when team is unknown', function() {
      assert.equal(trains.searchTeam('Unknown'), 0);
    });
    it('should return one-element array when team is known', function() {
      var found = trains.searchTeam('avenger');
      assert.equal(found.length, 1);
      assert.equal(found[0].name, 'The Avengers (Indigo)');
      assert.equal(found[0].href, '/trains/Indigo#The Avengers');
    });
  });


  describe('Markdown Rendering', function() {
    it('User rendering should provide a correct Markdown', function() {
      /*var rendering = '[**John Doe**](http://wwwin-tools.cisco.com/dir/johndoe) (The Avengers) '+
                      '![johndoe](http://wwwin.cisco.com/dir/photo/std/johndoe.jpg)';*/
      var rendering = '[**John Doe**](http://wwwin-tools.cisco.com/dir/johndoe) (The Avengers) : Super Hero';
      assert.equal(renderUser(user), rendering);
    });
    it('Team rendering should provide a correct Markdown', function() {
      var rendering = 'Team **"The Avengers"** :\n'+
                      '- [**John Doe**](http://wwwin-tools.cisco.com/dir/johndoe) : Super Hero\n'+
                      '- [**Iron Man**](http://wwwin-tools.cisco.com/dir/ironman) : Super Hero\n';
      assert.equal(renderTeam(team), rendering);
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
