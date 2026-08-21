const crypto = require("crypto");

const { PutObjectCommand, HeadObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = require("../../config/s3");

const uploadRepository = require("./upload.repository");

const AppError = require("../../shared/errors/AppError");

const { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE, MIME_TO_EXTENSION } = require("./upload.constants");

const UPLOAD_TYPES = ["profile", "product"];

/**
 * Issues a short-lived presigned PUT for a single image.
 *
 * The type and size checks are the only ones that can happen: once the URL is
 * signed the client talks to S3 directly, and nothing of ours sits in that
 * path. Signing the content type and length into the URL means S3 itself
 * rejects a request that does not match, so an unchecked URL here would be an
 * open door to the bucket.
 */
const generatedUploadUrl = async ({ userId, fileType, fileSize, type }) => {
    if (!UPLOAD_TYPES.includes(type)) {
        throw new AppError("Invalid upload type", 400);
    }

    if (!ALLOWED_IMAGE_TYPES.includes(fileType)) {
        throw new AppError(
            `Unsupported file type. Allowed: ${ALLOWED_IMAGE_TYPES.join(", ")}`,
            400
        );
    }

    const size = Number(fileSize);

    if (!Number.isFinite(size) || size <= 0) {
        throw new AppError("fileSize is required", 400);
    }

    if (size > MAX_IMAGE_SIZE) {
        throw new AppError(
            `File exceeds the ${MAX_IMAGE_SIZE / (1024 * 1024)}MB limit`,
            400
        );
    }

    // The stored name is always generated, so a hostile filename can never
    // shape the object key.
    const uniqueFileName = `${crypto.randomUUID()}.${MIME_TO_EXTENSION[fileType]}`;

    const key = type === "profile"
        ? `users/${userId}/profile/${uniqueFileName}`
        : `products/${userId}/${uniqueFileName}`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        ContentType: fileType,
        // Binds the declared size into the signature: S3 refuses a PUT whose
        // body length differs, so the limit above cannot be walked around.
        ContentLength: size
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 60
    });

    return {
        uploadUrl, key
    };
};

/**
 * Confirms an upload actually landed, and re-checks it against the same limits.
 *
 * The client performed the PUT unsupervised, so what is in the bucket is
 * treated as untrusted until this reads the real object metadata back.
 */
const confirmUpload = async ({ userId, key }) => {
    const isProfileKey = key.startsWith(`users/${userId}/profile/`);
    const isProductKey = key.startsWith(`products/${userId}/`);

    if (!isProfileKey && !isProductKey) {
        throw new AppError("Invalid file ownership", 403);
    }

    const command = new HeadObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
    });

    const metadata = await s3Client.send(command);

    if (!ALLOWED_IMAGE_TYPES.includes(metadata.ContentType)) {
        throw new AppError("Uploaded file is not a supported image", 400);
    }

    if (metadata.ContentLength > MAX_IMAGE_SIZE) {
        throw new AppError("Uploaded file exceeds the size limit", 400);
    }

    return {
        key,
        size: metadata.ContentLength,
        mimeType: metadata.ContentType
    };
};

const createUploadRecord = async (payload) => {
    const upload = await uploadRepository.createUpload(payload);

    return upload;
};

const getUserUploads = async (userId) => {
    return uploadRepository.findUploadByUser(userId);
};

const generateDownloadUrl = async ({ userId, uploadId }) => {
    const upload = await uploadRepository.findUploadById(uploadId);

    if (!upload) {
        throw new AppError("File not found", 404);
    }

    if (upload.user.toString() !== userId.toString()) {
        throw new AppError("Not authorised to access this file", 403);
    }

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
        throw new AppError("File not found", 404);
    }

    if (upload.user.toString() !== userId.toString()) {
        throw new AppError("Not authorised to delete this file", 403);
    }

    const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: upload.s3Key
    });

    await s3Client.send(command);

    await uploadRepository.deleteUpload(uploadId);

    return {
        message: "File deleted successfully"
    };
};

module.exports = { generatedUploadUrl, confirmUpload, createUploadRecord, getUserUploads, generateDownloadUrl, deleteUpload };
