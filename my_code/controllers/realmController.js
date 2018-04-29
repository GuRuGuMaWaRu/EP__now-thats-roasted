exports.homePage = (req, res) => {
  res.render("home");
};

exports.gondorIndex = (req, res) => {
  res.render("./gondor/gondorIndex");
};

exports.rohanIndex = (req, res) => {
  res.render("./rohan/rohanIndex");
};
