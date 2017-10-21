var Waterline = require("waterline");
var waterline = new Waterline();
var crypto = require("crypto");

var DB_URL = process.env.DATABASE_URL;
var config;

//define our connections config
if (DB_URL) {
  console.log("DB URL detected, running using POSTGRESQL");
  config = require("./config/postgres").default;
} else {
  console.log("No DB URL env variable detected, running using disk storage");
  config = require("./config/disk").default;
}

//user renamed to user_acc because postgres conflict
//user collection (id,username,password,messages)
var userCollection = require("./models/user").default;

//message collection (id,message,user)
var messageCollection = require("./models/message").default;

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
    });

    if (user) {
      user.password = decrypt(user.password);
    }

    return user;
  };

  exports.newMessage = async function (username, message) {
    let user = await User.findOne({
      username: username
    });

    message = Object.assign(await Message.create({
      message: message,
      user_acc: user
    }), { user_acc: user });

    return message;
  };

  exports.getMessages = async function () {
    let messages = await Message.find().populate("user_acc");

    return messages;
  };
});
