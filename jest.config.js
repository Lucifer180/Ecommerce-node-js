module.exports = {
    testEnvironment: "node",
    // Boots one in-memory MongoDB replica set for the whole run. A replica set
    // (not a standalone) is required because checkout runs in a transaction,
    // and transactions need an oplog.
    globalSetup: "<rootDir>/tests/setup/globalSetup.js",
    globalTeardown: "<rootDir>/tests/setup/globalTeardown.js",
    setupFiles: ["<rootDir>/tests/setup/env.js"],
    testMatch: ["<rootDir>/tests/**/*.test.js"],
    collectCoverageFrom: [
        "src/**/*.js",
        "!src/config/**",
    ],
    // Surfaces anything left holding the event loop instead of hanging the run.
    testTimeout: 30000,
};
