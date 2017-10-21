const postgresAdapter = require("sails-postgresql");
let DB_URL = process.env.DATABASE_URL;
let migrate;

if (process.env.NODE_ENV == "production")
  migrate = "safe";
else
  migrate = "alter";

exports.default = {
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
