const asyncHandler = require("../../shared/utils/asyncHandler");
const uploadService = require("./upload.service");

exports.generateUploadurl = asyncHandler(async (req, res) => {
    // fileName is deliberately ignored: the stored key is always generated.
    const { fileType, fileSize, type } = req.body;

    const result = await uploadService.generatedUploadUrl({
        userId: req.user._id,
        fileType,
        fileSize,
        type
    });

    res.status(200).json({
        success: true,
        uploadUrl: result.uploadUrl,
        key: result.key
    })
});

exports.confirmUpload = asyncHandler(async (req, res) => {

    const { key, originalName, type } = req.body;

    const result = await uploadService.confirmUpload({ userId: req.user._id, key });

    const upload = await uploadService.createUploadRecord({
        user: req.user._id,
        originalName,
        s3Key: result.key,
        mimeType: result.mimeType,
        size: result.size,
        type: type
    });
    res.status(201).json({
        success: true,
        upload
    });

});

exports.getUserUpload = asyncHandler(async (req, res) => {
    const uploads = await uploadService.getUserUploads(req.user._id);

    res.status(200).json({
        success: true,
        uploads
    })
});

exports.generateDownloadUrl = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await uploadService.generateDownloadUrl({
        userId: req.user._id,
        uploadId: id.trim()
    });

    res.status(200).json({
        success: true,
        downloadUrl: result.downloadUrl
    }
    )
});

exports.deleteUpload = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = uploadService.deleteUpload({
        userId: req.user._id,
        uploadId: id.trim()
    });

    res.status(200).json({
        success: true,
        message: (await result).message
    })
});

