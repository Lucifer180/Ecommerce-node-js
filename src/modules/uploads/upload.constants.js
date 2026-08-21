// Kept in sync with MIME_TO_EXTENSION below: a type allowed here but missing
// there would produce an object key with an "undefined" extension.
const ALLOWED_IMAGE_TYPES = [
    "image/jpeg", "image/png", "image/webp"
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const MIME_TO_EXTENSION = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp"
};

module.exports = {
    ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE, MIME_TO_EXTENSION
};
