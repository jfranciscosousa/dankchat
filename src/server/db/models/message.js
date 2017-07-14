var Waterline = require("waterline");

exports.default = Waterline.Collection.extend({
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