const cluster = require("cluster");
const os = require("os");
require("dotenv").config({ quiet: true });

// One worker per core, capped by WEB_CONCURRENCY. The default is deliberate on
// the 1 GB deployment box, where forking every core exhausts memory before it
// buys any throughput.
const workerCount = Number(process.env.WEB_CONCURRENCY) || os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary process ${process.pid} starting ${workerCount} worker(s)`);

    for (let i = 0; i < workerCount; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died (${signal || code}). Forking a replacement...`);

        // Previously this only logged, so the pool shrank with every crash until
        // no workers were left to serve traffic.
        cluster.fork();
    });
} else {
    require("./server");
}
