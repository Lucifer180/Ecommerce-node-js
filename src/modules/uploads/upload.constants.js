const ALLOWED_IMAGES_TYPES = [
    "image/jpg", "image/png", "image/webp"
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const MIME_TO_EXTENSION = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp"
};

module.exports = {
    ALLOWED_IMAGES_TYPES, MAX_IMAGE_SIZE, MIME_TO_EXTENSION
};