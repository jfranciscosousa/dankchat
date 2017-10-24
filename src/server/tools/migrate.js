const Waterline = require("waterline");

const waterline = new Waterline();
const user = require("../../server/db/models/user").default;
const message = require("../../server/db/models/message").default;
const config = require("../../server/db/config/postgres").default;

waterline.loadCollection(user);
waterline.loadCollection(message);

config.defaults.migrate = "alter";

waterline.initialize(config, err => {
  if (err) {
    console.trace(err);
  } else {
    console.log("Migration completed");
  }

  process.exit(0);
});
