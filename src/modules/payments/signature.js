const crypto = require("crypto");

/**
 * Constant-time comparison of a Razorpay HMAC-SHA256 signature.
 *
 * Razorpay signs two different payloads with two different secrets: the client
 * handshake is `<razorpay_order_id>|<razorpay_payment_id>` signed with the API
 * key secret, and the webhook is the raw request body signed with the webhook
 * secret. Both land here.
 *
 * The comparison is timing-safe so a caller cannot reconstruct a valid
 * signature byte by byte from how long the check takes.
 */
const isValidSignature = (payload, signature, secret) => {
    if (!signature || !secret) return false;

    // Buffer.from truncates invalid hex rather than throwing, which would let a
    // malformed signature reach the comparison with the wrong length.
    if (!/^[0-9a-f]+$/i.test(signature)) return false;

    const expected = crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest();

    const received = Buffer.from(signature, "hex");

    // timingSafeEqual throws on a length mismatch, so screen for that first.
    if (received.length !== expected.length) return false;

    return crypto.timingSafeEqual(expected, received);
};

module.exports = { isValidSignature };
