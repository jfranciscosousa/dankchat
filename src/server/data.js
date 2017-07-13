var Waterline = require("waterline");
var waterline = new Waterline();
var sailsDiskAdapter = require("sails-disk");
var postgresAdapter = require("sails-postgresql");
var crypto = require("crypto");

var DB_URL = process.env.DATABASE_URL;
var config, migrate;

if (process.env.NODE_ENV == "production")
  migrate = "safe";
else
  migrate = "alter";

//define our connections config
if (DB_URL) {
  console.log("DB URL detected, running using POSTGRESQL");
  config = {
    adapters: {
      "postgresql": postgresAdapter
    },
    defaults: {
      migrate: migrate
    },
    connections: {
      default: {
        adapter: "postgresql",
        url: DB_URL
      }
    }
  };
} else {
  console.log("No DB URL env variable detected, running using disk storage");
  config = {
    adapters: {
      "disk": sailsDiskAdapter
    },
    defaults: {
      migrate: "alter"
    },
    connections: {
      default: {
        adapter: "disk"
      }
    }
  };
}

//user renamed to user_acc because postgres conflict
//user collection (id,username,password,messages)
var userCollection = Waterline.Collection.extend({
  schema: "true",
  identity: "user_acc",
  connection: "default",
  attributes: {
    id: {
      type: "integer",
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    username: {
      type: "string",
      unique: true,
      required: true
    },
    password: {
      type: "string",
      required: true
    },

    messages: {
      collection: "message",
      via: "user_acc"
    }
  }
});

//message collection (id,message,user)
var messageCollection = Waterline.Collection.extend({
  schema: "true",
  identity: "message",
  connection: "default",
  attributes: {
    id: {
      type: "integer",
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    message: "string",
    // Add a reference to User
    user_acc: {
      model: "user_acc"
    }
  }
});

//load the collections
waterline.loadCollection(userCollection);
waterline.loadCollection(messageCollection);

//define our data access facade
var exports = module.exports = {};

// encryption
var algorithm = "aes-256-ctr";
var key = process.env.ENCRYPTION_KEY || "DANK_FRESH_MEMES";

function encrypt(text) {
  var cipher = crypto.createCipher(algorithm, key);
  var crypted = cipher.update(text, "utf8", "hex");
  return crypted + cipher.final("hex");
}

function decrypt(text) {
  var decipher = crypto.createDecipher(algorithm, key);
  var decrypted = decipher.update(text, "hex", "utf8");
  return decrypted + decipher.final("utf8");
}

waterline.initialize(config, function (err, ontology) {
  if (err) {
    return console.error(err);
  }

  console.log("Initialized DB connection");

  var User = ontology.collections.user_acc;
  var Message = ontology.collections.message;

  exports.newUser = function (username, password) {
    let enc_password = encrypt(password);

    return User.create({
      username: username,
      password: enc_password
    });
  };

  exports.getUser = async function (username) {
    let user = await User.findOne({
      username: username
    })

    if (user) {
      user.password = decrypt(user.password);
    }

    return user;
  };

  exports.newMessage = async function (username, message) {
    let user = await User.findOne({
      username: username
    })

    return Message.create({
      message: message,
      user_acc: user
    });
  };

  exports.getMessages = async function () {
    let messages = await Message.find().populate("user_acc");
    return messages;
  };
});
