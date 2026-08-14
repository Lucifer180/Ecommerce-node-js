const User = require("../auth/user.model");
const emailQueue = require("../../queues/email.queue");
const AppError = require("../../shared/errors/AppError");

/** Plain-text fallback wrapped in the same markup every notification uses. */
const buildHtml = (subject, message) => `
    <div style="font-family: -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
        <h2 style="margin: 0 0 16px; font-size: 20px; color: #101828;">${subject}</h2>
        <div style="font-size: 15px; line-height: 1.6; color: #475467; white-space: pre-wrap;">${message}</div>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #EAECF0;" />
        <p style="font-size: 13px; color: #98A2B3; margin: 0;">You are receiving this because you have an account with us.</p>
    </div>
`;

/**
 * Queues one email job per recipient rather than a single job with many
 * addresses, so a failure to one user retries independently and nobody sees
 * anyone else's address.
 */
const sendNotification = async ({ subject, message, userIds }) => {
    if (!subject || !message) {
        throw new AppError("Subject and message are required", 400);
    }

    const filter = Array.isArray(userIds) && userIds.length ? { _id: { $in: userIds } } : {};

    const recipients = await User.find(filter).select("name email");

    if (!recipients.length) {
        throw new AppError("No recipients matched", 404);
    }

    const html = buildHtml(subject, message);

    await Promise.all(
        recipients.map((recipient) =>
            emailQueue.add(
                "notification",
                {
                    to: recipient.email,
                    subject,
                    text: message,
                    html,
                },
                {
                    attempts: 3,
                    backoff: { type: "exponential", delay: 5000 },
                    removeOnComplete: true,
                }
            )
        )
    );

    return {
        queued: recipients.length,
        recipients: recipients.map((recipient) => recipient.email),
    };
};

module.exports = { sendNotification };
