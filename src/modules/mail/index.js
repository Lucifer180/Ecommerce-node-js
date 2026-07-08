const express = require("express");
const router = express.Router();

const sendEmail = require("../../shared/utils/sendEmail");

router.get("/", async (req, res) => {
    try {
        await sendEmail({
            to: "shreyas.s@diatoz.com",
            subject: "SMTP Working",
            text: "Congratulations! your SMTP setup is working",
            html: `
                <h1>SMTP Working 🚀</h1>
                <p>Your ecommerce backend can now send emails.</p>
            `,
        });

        return res.status(200).json({
            success: true,
            message: "Email sent successfully",
        });

    } catch (error) {
        console.error("Email sending failed:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to send email",
            error: error.message, // optional (remove in production)
        });
    }
});

module.exports = router;