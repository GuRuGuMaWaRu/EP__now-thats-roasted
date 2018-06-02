const mongoose = require("mongoose");
const Realm = mongoose.model("Realm");

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

exports.createRealm = async (req, res) => {
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

exports.editRealm = async (req, res) => {
  const realm = await Realm.findOne({ _id: req.params.id });
  res.render("./editRealm", { title: `Edit ${realm.name}`, realm });
};

exports.updateRealm = async (req, res) => {
  const realm = await Realm.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return new store instead of the old one
    runValidators: true
  }).exec();

  console.log(req.body);
  req.flash(
    "success",
    `Successfully updated <strong>${realm.name}</strong>! <a href="/realms/${
      realm._id
    }">View realm ---></a>`
  );

  res.redirect(`/realms/${realm._id}/edit`);
};
