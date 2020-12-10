const nodemailer = require("nodemailer");

const sendMail = (email, subject, content) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "thanhhainodejsmailer@gmail.com",
      pass: "thanhhai7698",
    },
  });

  const mailOption = {
    from: "thanhhainodejsmailer@gmail.com",
    to: `${email}`, //gui den nhieu nguoi nhan
    subject: subject,
    text: `I am nodejs send by Thanh Hai, I inform you: ${content} `,
    //html: '<h2>Welcome </h2>'
  };

  // console.log(email);

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
