var Waterline = require('waterline');
var sailsMemoryAdapter = require('sails-memory');
var postgresAdapter = require('sails-postgresql');
var waterline = new Waterline();
var exports = module.exports = {};

var userCollection = Waterline.Collection.extend({
  identity: 'user',
  connection: 'default',
  attributes: {
    username: {
      type: 'string',
      unique: true,
      required: true
    },
    password: {
      type: 'string',
      required: true
    },

    messages: {
      collection: 'message',
      via: 'user'
    }
  }
});

var messageCollection = Waterline.Collection.extend({
  identity: 'message',
  connection: 'default',
  attributes: {
    message: 'string',

    // Add a reference to User
    user: {
      model: 'user'
    }
  }
});

waterline.loadCollection(userCollection);
waterline.loadCollection(messageCollection);

var DB_URL = process.env.DB_URL;
var config;

if (DB_URL) {
  console.log("DB URL detected, running using POSTGRESQL");
  config = {
    adapters: {
      'postgresql': postgresAdapter
    },
    connections: {
      default: {
        adapter: 'postgresql',
        url: DB_URL,
        ssl: true
      }
    }
  };
} else {
  console.log("No DB URL env variable detected, running on memory");
  config = {
    adapters: {
      'memory': sailsMemoryAdapter
    },
    connections: {
      default: {
        adapter: 'memory'
      }
    }
  };
}



waterline.initialize(config, function(err, ontology) {
  if (err) {
    return console.error(err);
  }

  var User = ontology.collections.user;
  var Message = ontology.collections.message;

  exports.newUser = function(username, password, callback) {
    User.create({
      username: username,
      password: password
    }).then(function(user) {
      typeof callback === 'function' && callback(user);
    });
  };

  exports.getUser = function(username, callback) {
    User.findOne({
      username: username
    }).then(function(user) {
      typeof callback === 'function' && callback(user);
    });
  };

  exports.newMessage = function(username, message, callback) {
    User.findOne({
      username: username
    }).then(function(user) {
      return Message.create({
        message: message,
        user: user.id
      });
    }).then(function(message) {
      typeof callback === 'function' && callback(message);
    });
  }
});
