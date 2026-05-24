const {Queue} = require("bullmq");
const connection = require("../config/queue");

const emailQueue = new Queue("emailQueue",{
    connection
});

module.exports = emailQueue;