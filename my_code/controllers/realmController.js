exports.homePage = (req, res) => {
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
