const Waterline = require("waterline");

const waterline = new Waterline();
const crypto = require("crypto");

const DB_URL = process.env.DATABASE_URL;
let config;

// define our connections config
if (DB_URL) {
  console.log("DB URL detected, running using POSTGRESQL");
  config = require("./config/postgres").default;
} else {
  console.log("No DB URL env variable detected, running using disk storage");
  config = require("./config/disk").default;
}

// user renamed to user_acc because postgres conflict
// user collection (id,username,password,messages)
const userCollection = require("./models/user").default;

// message collection (id,message,user)
const messageCollection = require("./models/message").default;

// load the collections
waterline.loadCollection(userCollection);
waterline.loadCollection(messageCollection);

// encryption
const algorithm = "aes-256-ctr";
const key = process.env.ENCRYPTION_KEY || "DANK_FRESH_MEMES";

function encrypt(text) {
  const cipher = crypto.createCipher(algorithm, key);
  const crypted = cipher.update(text, "utf8", "hex");
  return crypted + cipher.final("hex");
}

function decrypt(text) {
  const decipher = crypto.createDecipher(algorithm, key);
  const decrypted = decipher.update(text, "hex", "utf8");
  return decrypted + decipher.final("utf8");
}

waterline.initialize(config, (err, ontology) => {
  if (err) {
    return console.error(err);
  }

  console.log("Initialized DB connection");

  const User = ontology.collections.user_acc;
  const Message = ontology.collections.message;

  module.exports.newUser = (username, password) => {
    const encryptedPassword = encrypt(password);

    return User.create({
      username,
      password: encryptedPassword
    });
  };

  module.exports.getUser = async username => {
    const user = await User.findOne({
      username
    });

    if (user) {
      user.password = decrypt(user.password);
    }

    return user;
  };

  module.exports.newMessage = async (username, message) => {
    const user = await User.findOne({
      username
    });

    message = Object.assign(
      await Message.create({
        message,
        user_acc: user
      }),
      { user_acc: user }
    );

    return message;
  };

  module.exports.getMessages = async () => {
    const messages = await Message.find().populate("user_acc");

    return messages;
  };
});
