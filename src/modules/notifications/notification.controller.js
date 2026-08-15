const asyncHandler = require("../../shared/utils/asyncHandler");
const notificationService = require("./notification.service");

exports.sendNotification = asyncHandler(async (req, res) => {
    const { subject, message, userIds } = req.body;

    const result = await notificationService.sendNotification({ subject, message, userIds });

    res.status(202).json({
        success: true,
        message: `Queued ${result.queued} ${result.queued === 1 ? "email" : "emails"}`,
        data: result,
    });
});
