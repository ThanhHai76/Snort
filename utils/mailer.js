const nodemailer = require("nodemailer");
const adminEmail = "thanhhainodejsmailer@gmail.com";
const adminPasswork = "thanhhai7698";
// host của google - gmail
const mailHost = 'smtp.gmail.com'
// 587 là một cổng tiêu chuẩn và phổ biến trong giao thức SMTP
const mailPort = 587

const sendMail = (email, subject, content) => {
  const transporter = nodemailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: false,
    service: "gmail",
    auth: {
      user: adminEmail,
      pass: adminPasswork,
    },
  });

  const mailOption = {
    from: adminEmail,
    to: `${email}`, //gui den nhieu nguoi nhan
    subject: subject,
    text: `I am Snort send by Thanh Hai, I inform you: ${content} `,
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
