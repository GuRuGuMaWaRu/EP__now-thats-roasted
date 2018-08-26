const passport = require("passport");
const crypto = require("crypto");
const { promisify } = require("es6-promisify");
const mongoose = require("mongoose");

const User = mongoose.model("User");
const mail = require("../handlers/mail");

exports.login = passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: "Failed login!",
  successRedirect: "/",
  successFlash: "You are now logged in!"
});

exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "You are now logged out!");
  res.redirect("/");
};

exports.isLoggedIn = (req, res, next) => {
  // first check if the user is authenticated
  if (req.isAuthenticated()) {
    return next(); // carry on! You are logged in!
  }

  req.flash("error", "Oops! You must be logged in to do that!");
  res.redirect("/login");
};

exports.forgot = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    req.flash("error", "The account with this email does not exist.");
    return res.redirect("/login");
  }

  user.passwordResetToken = crypto.randomBytes(20).toString("hex");
  user.passwordResetExpires = Date.now() + 3600000; // 1 hour from now
  await user.save();

  const resetURL = `http://${req.headers.host}/account/reset/${
    user.passwordResetToken
  }`;

  await mail.send({
    filename: "password-reset",
    user,
    subject: "Password Reset",
    resetURL
  });

  req.flash("success", `You have been emailed a password reset link`);
  res.redirect("/login");
};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    passwordResetToken: req.params.token,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    req.flash("error", "Password reset is invalid or expired");
    return res.redirect("/login");
  }

  res.render("reset", { title: "Reset your Password" });
};

exports.comparePasswords = (req, res, next) => {
  if (req.body.password === req.body["password-confirm"]) {
    next();
    return;
  }

  req.flash("error", "Passwords do not match!");
  res.redirect("back");
};

exports.update = async (req, res) => {
  const user = await User.findOne({
    passwordResetToken: req.params.token,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    req.flash("error", "Password reset is invalid or expired");
    return res.redirect("/login");
  }

  const setPasswordWithPromise = promisify(
    User.setPasswordWithPromise.bind(User)
  );

  await setPasswordWithPromise(req.body.password);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser);
  req.flash(
    "success",
    "Super! Your password has been reset! You are being logged in!"
  );
  req.redirect("/");
};
