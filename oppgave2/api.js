const ApiBuilder = require("claudia-api-builder");
const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const api = new ApiBuilder();

api.get("/vippetangen", async () => {
    const params = {
        TableName: "DepartureTime",
        Key: {
            StopPlace: "Vippetangen",
        },
    };

    const data = await dynamoDB.get(params).promise();
    return data;
});

module.exports = api;
