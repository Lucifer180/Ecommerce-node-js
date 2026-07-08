const transporter = require("../../config/mail");

const verifyMail = async () => {

    try {

        await transporter.verify();

        console.log("SMTP Connected");

    } catch (err) {

        console.error("SMTP Error:", err.message);

    }

};

module.exports = verifyMail;