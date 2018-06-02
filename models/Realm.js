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
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: "Point"
    },
    coordinates: [{ type: Number, required: "Please provide coordinates!" }],
    address: {
      type: String,
      required: "Please provide address!"
    }
  }
});

realmSchema.pre("save", function(next) {
  if (!this.isModified("name")) {
    next(); // skip it
    return; // stop this fn from running
  }

  this.slug = slug(this.name);
  next();
});

module.exports = mongoose.model("Realm", realmSchema);
