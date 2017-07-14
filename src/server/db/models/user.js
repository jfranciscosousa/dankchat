var Waterline = require("waterline");

exports.default = Waterline.Collection.extend({
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