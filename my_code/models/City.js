const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slugs");

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Please provide the city's name"
  },
  description: {
    type: String,
    trim: true
  },
  slug: String,
  tags: [String]
});

citySchema.pre("save", function(next) {
  if (!this.isModified("name")) {
    next();
    return;
  }

  this.slug = slug(this.name);
  next();
});

module.exports = mongoose.model("City", citySchema);
