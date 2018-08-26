const nodemailer = require("nodemailer");
const pug = require("pug");
const juice = require("juice");
const htmlToText = require("html-to-text");
const { promisify } = require("es6-promisify");

console.log("process.env.MAIL_HOST: ", process.env.MAIL_HOST);
console.log("process.env.MAIL_PORT: ", process.env.MAIL_PORT);
console.log("process.env.MAIL_USER: ", process.env.MAIL_USER);
console.log("process.env.MAIL_PASS: ", process.env.MAIL_PASS);

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(
    `${__dirname}/../views/email/${filename}.pug`,
    options
  );
  const inlined = juice(html);

  return inlined;
};

exports.send = async options => {
  const html = generateHTML(options.filename, options);
  const text = htmlToText.fromString(html);

  const mailOptions = {
    from: "Peter Krevenets <peter.k.nets@gmail.com>",
    to: options.user.email,
    subject: options.subject,
    html,
    text
  };

  const sendEmail = promisify(transport.sendMail.bind(transport));

  return sendEmail(mailOptions);
};
