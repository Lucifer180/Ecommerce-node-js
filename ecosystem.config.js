/**
 * pm2 process definition used by the deploy workflow.
 *
 * Sized for the 1 GB Oracle Always Free box: a single API instance rather than
 * one per core, because on this host extra workers exhaust memory long before
 * they add throughput. Scale `instances` up only on a bigger machine.
 */
module.exports = {
    apps: [
        {
            name: "ecommerce-api",
            script: "server.js",
            instances: 1,
            exec_mode: "fork",
            autorestart: true,
            max_memory_restart: "400M",
            env: {
                NODE_ENV: "production",
                PORT: 5000,
            },
        },
        {
            // Drains the BullMQ email queue. Without it, password-reset and
            // notification jobs queue up in Redis and are never delivered.
            name: "ecommerce-worker",
            script: "worker.js",
            instances: 1,
            exec_mode: "fork",
            autorestart: true,
            max_memory_restart: "250M",
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
