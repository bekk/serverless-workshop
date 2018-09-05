const ApiBuilder = require('claudia-api-builder');
const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const api = new ApiBuilder();

module.exports = api;
