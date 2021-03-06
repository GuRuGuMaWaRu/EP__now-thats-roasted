const mongoose = require("mongoose");
const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid");
const Realm = mongoose.model("Realm");

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith("image/");

    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: "That filetype isn't allowed" }, false);
    }
  }
};

exports.homePage = (req, res) => {
  req.flash("success", "success message");
  req.flash("error", "error message");
  req.flash("info", "info message");
  req.flash("warning", "warning message");
  res.render("home", { title: "Middlearth Travelogue" });
};

exports.gondorIndex = (req, res) => {
  res.render("./gondor/gondorIndex", { title: "Gondor" });
};

exports.rohanIndex = (req, res) => {
  res.render("./rohan/rohanIndex", { title: "Rohan " });
};

exports.addRealm = (req, res) => {
  res.render("./editRealm", { title: "Add New Realm" });
};

exports.upload = multer(multerOptions).single("photo");

exports.resize = async (req, res, next) => {
  // check if there is no file to resize
  if (!req.file) {
    next(); // skip to the next middleware
    return;
  }

  const extension = req.file.mimetype.split("/")[1];
  req.body.photo = `${uuid.v4()}.${extension}`;

  // now resize & write to disk
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);

  // keep on
  next();
};

exports.createRealm = async (req, res) => {
  req.body.author = req.user._id;
  const realm = await new Realm(req.body).save();
  req.flash(
    "success",
    `Successfully created <strong>${req.body.name}</strong>`
  );
  res.redirect(`/realm/${realm.slug}`);
};

exports.getRealms = async (req, res) => {
  const realms = await Realm.find();
  res.render("./realms", { title: "Realms", realms });
};

const confirmOwner = (realm, user) => {
  if (!realm.author.equals(user._id)) {
    throw Error("You must own a realm in order to edit it!");
  }
};

exports.editRealm = async (req, res) => {
  const realm = await Realm.findOne({ _id: req.params.id });
  confirmOwner(realm, req.user);
  res.render("./editRealm", { title: `Edit ${realm.name}`, realm });
};

exports.updateRealm = async (req, res) => {
  req.body.location.type = "Point";

  const realm = await Realm.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return new store instead of the old one
    runValidators: true
  }).exec();

  req.flash(
    "success",
    `Successfully updated <strong>${realm.name}</strong>! <a href="/realm/${
      realm.slug
    }">View realm ---></a>`
  );

  res.redirect(`/realms/${realm._id}/edit`);
};

exports.getRealmBySlug = async (req, res, next) => {
  const realm = await Realm.findOne({ slug: req.params.slug }).populate(
    "author"
  );

  // move to NOT FOUND page
  if (!realm) {
    return next();
  }
  // res.json(realm);
  res.render("realm", { realm, title: realm.name });
};

exports.getRealmsByTag = async (req, res) => {
  const tag = req.params.tag;
  const tagQuery = tag || { $exists: true };
  const tagsPromise = Realm.getTagsList();
  const realmsPromise = Realm.find({ tags: tagQuery });
  const [tags, realms] = await Promise.all([tagsPromise, realmsPromise]);

  res.render("tags", { tags, tag, realms, title: "Tags" });
};

exports.searchRealms = async (req, res) => {
  const realms = await Realm.find(
    // first find realms that match
    {
      $text: {
        $search: req.query.q
      }
    },
    {
      score: { $meta: "textScore" }
    }
  )
    .sort({
      // then sort them
      score: { $meta: "textScore" }
    })
    .limit(5); // limit to only 5 results

  res.json(realms);
};
