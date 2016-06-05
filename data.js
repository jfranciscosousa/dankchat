var Waterline = require('waterline');
var waterline = new Waterline();
var sailsDiskAdapter = require('sails-disk');
var postgresAdapter = require('sails-postgresql');

var DB_URL = process.env.DB_URL;
var config;

//define our connections config
if (DB_URL) {
  console.log("DB URL detected, running using POSTGRESQL");
  config = {
    adapters: {
      'postgresql': postgresAdapter
    },
    defaults: {
      migrate: 'safe'
    },
    connections: {
      default: {
        adapter: 'postgresql',
        url: DB_URL
      }
    }
  };
} else {
  console.log("No DB URL env variable detected, running using disk storage");
  config = {
    adapters: {
      'disk': sailsDiskAdapter
    },
    defaults: {
      migrate: 'safe'
    },
    connections: {
      default: {
        adapter: 'disk'
      }
    }
  };
}

//user renamed to user_acc because postgres conflict
//user collection (id,username,password,messages)
var userCollection = Waterline.Collection.extend({
  schema: 'true',
  identity: 'user_acc',
  connection: 'default',
  attributes: {
    id: {
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
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
      via: 'user_acc'
    }
  }
});

//message collection (id,message,user)
var messageCollection = Waterline.Collection.extend({
  schema: 'true',
  identity: 'message',
  connection: 'default',
  attributes: {
    id: {
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    message: 'string',
    // Add a reference to User
    user_acc: {
      model: 'user_acc'
    }
  }
});

//load the collections
waterline.loadCollection(userCollection);
waterline.loadCollection(messageCollection);



//define our data access facade
var exports = module.exports = {};

waterline.initialize(config, function(err, ontology) {
  if (err) {
    return console.error(err);
  }

  console.log("DB Connection INIT");

  var User = ontology.collections.user_acc;
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
        user_acc: user
      });
    }).then(function(message) {
      typeof callback === 'function' && callback(message);
    });
  }

  exports.getMessages = function(callback){
    Message.find().populate('user_acc').then(function(messages) {
      typeof callback === 'function' && callback(messages);
    });
  }
});
