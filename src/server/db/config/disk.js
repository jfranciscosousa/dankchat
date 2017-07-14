var sailsDiskAdapter = require("sails-disk");

exports.default = {
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