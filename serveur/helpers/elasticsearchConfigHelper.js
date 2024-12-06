const { Client } = require('@elastic/elasticsearch');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const elasticNode = process.env.ENVIRONMENT === 'docker'
    ? process.env.ELASTIC_NODE_DOCKER
    : process.env.ELASTIC_NODE_LOCAL;

const client = new Client({
    node: elasticNode,
    auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD
    }
});

module.exports = client;

