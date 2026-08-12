const express = require("express");

const { generateUploadurl,
    // getUploadFiles,
    confirmUpload,
    getUserUpload,
    generateDownloadUrl,
    deleteUpload
} = require("./uploadController");
const { protect } = require("../../shared/middlewares/auth.middleware");
const router = express.Router();

router.post("/presigned-url", protect, generateUploadurl);
//router.get("/uploads", protect, getUploadFiles)
router.post("/confirm", protect, confirmUpload);
router.get("/", protect, getUserUpload);
router.get("/:id/url", protect, generateDownloadUrl);
router.delete("/:id/url",protect,deleteUpload)
module.exports = router;
