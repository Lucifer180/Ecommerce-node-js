const transporter = require("../../config/mail");

const sendEmail = async ({ to, subject, html, text }) => {
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        text,
        html
    })
}
module.exports = sendEmail