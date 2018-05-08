const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slugs");

const realmSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Please provide a name for this realm!"
  },
  description: {
    type: String,
    trim: true
  },
  slug: String,
  tags: [String]
});

module.exports = mongoose.model("Realm", realmSchema);
