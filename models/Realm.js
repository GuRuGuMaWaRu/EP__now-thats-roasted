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
  },
  photo: String
});

realmSchema.pre("save", async function(next) {
  if (!this.isModified("name")) {
    next(); // skip it
    return; // stop this fn from running
  }

  this.slug = slug(this.name);
  // deal with possible duplicate slugs
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, "i");
  const storesWithCurrentSlug = await this.constructor.find({
    slug: slugRegEx
  });

  if (storesWithCurrentSlug.length) {
    this.slug = `${this.slug}-${storesWithCurrentSlug.length + 1}`;
  }

  next();
});

realmSchema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

module.exports = mongoose.model("Realm", realmSchema);
