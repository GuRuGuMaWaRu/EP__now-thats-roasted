const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slugs");

const heroSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Please provide name for this hero"
  },
  description: {
    type: String,
    trim: true
  },
  slug: String,
  tags: [String]
});

heroSchema.pre("save", function(next) {
  if (!this.isModified("name")) {
    next();
    return;
  }

  this.slug = slug(this.name);
  next();
});

module.exports = mongoose.model("Hero", heroSchema);
