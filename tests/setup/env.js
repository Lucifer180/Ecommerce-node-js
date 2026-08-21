/**
 * Test credentials, set before any application module loads.
 *
 * These run ahead of the `dotenv.config()` calls inside src/, and dotenv never
 * overwrites a variable that is already set — so the suite always runs on these
 * dummy values even on a machine with a fully populated .env. That keeps tests
 * deterministic and means CI needs no secrets to run them.
 */
process.env.NODE_ENV = "test";

const defaults = {
    JWT_SECRET: "test-jwt-secret",
    JWT_REFRESH_SECRET: "test-jwt-refresh-secret",
    RAZORPAY_KEY_ID: "rzp_test_dummy",
    RAZORPAY_KEY_SECRET: "rzp_test_dummy_secret",
    RAZORPAY_WEBHOOK_SECRET: "test-webhook-secret",
    AWS_REGION: "ap-south-1",
    SMTP_HOST: "localhost",
    SMTP_PORT: "1025",
    SMTP_EMAIL: "test@example.com",
    SMTP_PASSWORD: "test",
    SMTP_FROM: "test@example.com",
};

for (const [key, value] of Object.entries(defaults)) {
    process.env[key] = value;
}
