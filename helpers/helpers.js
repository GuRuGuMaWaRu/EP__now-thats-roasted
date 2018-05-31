const fs = require("fs");

exports.moment = require("moment");
exports.siteName = "Roasted Fingers Empire!";
exports.icon = name => fs.readFileSync(`./public/icons/${name}.svg`);
