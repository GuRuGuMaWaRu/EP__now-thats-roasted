const fs = require("fs");

exports.moment = require("moment");
exports.siteName = "Roasted Fingers Empire!";
exports.icon = name => fs.readFileSync(`./public/icons/${name}.svg`);

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = obj => JSON.stringify(obj, null, 2);
