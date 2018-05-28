const mongoose = require("mongoose");
const Realm = mongoose.model("Realm");

exports.homePage = (req, res) => {
  req.flash("success", "success message");
  req.flash("error", "error message");
  req.flash("info", "info message");
  req.flash("warning", "warning message");
  res.render("home", { title: "Home" });
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
  req.flash("success", `Succesfully created a new realm ${req.body.name}`);
  res.redirect(`/realm/${realm.slug}`);
};

exports.getRealms = async (req, res) => {
  const realms = await Realm.find();
  res.render("./realms", { title: "Realms", realms });
};
