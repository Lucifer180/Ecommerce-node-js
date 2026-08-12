const crypto = require("crypto");

const { PutObjectCommand, HeadObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = require("../../config/s3");

const uploadRepository = require("./upload.repository");

const { ALLOWED_IMAGES_TYPES, MAX_IMAGE_SIZE, MIME_TO_EXTENSION } = require("./upload.constants")

const generatedUploadUrl = async ({ userId, fileName, fileType, fileSize, type }) => {
    const fileExtension = MIME_TO_EXTENSION[fileType];
    const allowedTypes = ["profile", "product"];

    if (!allowedTypes.includes(type)) {
        throw new Error("Invalid upload type");
    }


    const uniqueFileName = `${crypto.randomUUID()}.${fileExtension}`;

    let key;

    if (type === "profile") {
        key = `users/${userId}/profile/${uniqueFileName}`;
    }

    if (type === "product") {
        key = `products/${userId}/${uniqueFileName}`;
    }

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        ContentType: fileType
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 60
    });

    return {
        uploadUrl, key
    }

};

const confirmUpload = async ({ userId, key }) => {

    const isProfileKey = key.startsWith(`users/${userId}/profile/`);
    const isProductKey = key.startsWith(`products/${userId}/`);

    if (!isProfileKey && !isProductKey) {
        throw new Error("Invalid file ownership");
    }

    const command = new HeadObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
    });

    const metaDeta = await s3Client.send(command);

    return {
        key,
        size: metaDeta.ContentLength,
        mimeType: metaDeta.ContentType
    }
};

const createUploadRecord = async (payload) => {
    const upload = await uploadRepository.createUpload(payload);

    return upload;
};

const getUserUploads = async (userId) => {
    return uploadRepository.findUploadByUser(userId);
};

const generateDownloadUrl = async ({ userId, uploadId }) => {
    console.log("Generating download URL for uploadId:", uploadId);
    const upload = await uploadRepository.findUploadById(uploadId);

    if (!upload) {
        throw new Error("file not found");
    };

    if (upload.user.toString() !== userId.toString()) {
        throw new Error("not authorised to access this file");
    };

    const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: upload.s3Key
    });

    const downloadUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 60
    });

    return {
        downloadUrl
    };
};

const deleteUpload = async ({ userId, uploadId }) => {
    const upload = await uploadRepository.findUploadById(uploadId);

    if (!upload) {
        throw new Error("file not found ");
    };

    if (upload.user.toString() !== userId.toString()) {
        {
            throw new Error("Not authorised to delete this file");
        }
    };

    const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: upload.s3Key
    });

    await s3Client.send(command);

    await uploadRepository.deleteUpload(uploadId);

    return {
        message: "file deleted succeessfully"
    }
}
module.exports = { generatedUploadUrl, confirmUpload, createUploadRecord, getUserUploads, generateDownloadUrl, deleteUpload };