const ApiBuilder = require('claudia-api-builder');
const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const api = new ApiBuilder();

const TABLE_NAME = '<Sett inn navnet på din tabell her>';

module.exports = api;
