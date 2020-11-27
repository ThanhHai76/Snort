const nodemailer = require("nodemailer");

const sendMail = (subject, content) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "thanhhainodejsmailer@gmail.com",
      pass: "thanhhai7698",
    },
  });

  const mailOption = {
    from: "thanhhai",
    to: "thanhhai7698@gmail.com", //gui den nhieu nguoi nhan
    subject: subject,
    text: `i am nodejs send by thanhhai, i inform you: ${content} `,
    //html: '<h2>Welcome </h2>'
  };

  return transporter.sendMail(mailOption, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email send:" + info.response);
    }
  });
};

module.exports = {
    sendMail : sendMail
}
