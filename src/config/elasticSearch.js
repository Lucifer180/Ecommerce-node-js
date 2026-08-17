const { Client } = require("@elastic/elasticsearch");
const { Transport } = require("@elastic/transport");

require("dotenv").config();

const elasticClient = new Client({
    node: process.env.ELASTICSEARCH_URL,
    Transport,
});

module.exports = elasticClient;