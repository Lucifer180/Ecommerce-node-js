const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
    {
        // Generated output and vendored code — nothing here is ours to fix.
        ignores: ["node_modules/**", "coverage/**", "logs/**"],
    },
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
        rules: {
            // Express error middleware is only recognised by its four-argument
            // signature, so `next` has to stay even when it goes unused.
            "no-unused-vars": ["error", { argsIgnorePattern: "^(next|req|res)$" }],
        },
    },
];
