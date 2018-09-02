const moment = require("moment");
const fetch = require("node-fetch");
const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async () => {
    const query = `{stopPlace(id: \"NSR:StopPlace:4227\") {id name estimatedCalls(startTime: \"${moment().format()}\", timeRange: 72100, numberOfDepartures: 10) { realtime aimedArrivalTime aimedDepartureTime expectedArrivalTime expectedDepartureTime actualArrivalTime actualDepartureTime date forBoarding forAlighting destinationDisplay { frontText } quay {   id } serviceJourney {   journeyPattern {     line {  id  name  transportMode     }   } }    }}}`;

    const response = await fetch("https://api.entur.org/journeyplanner/2.0/index/graphql", {
        method: "POST",
        body: JSON.stringify({ query }),
        headers: {
            "Content-Type": "application/json",
            "ET-Client-Name": "Serverless workshop @ BEKK",
            Accept: "application/json",
        },
    });
    const json = await response.json();

    await updateDynamoDB(
        json.data.stopPlace.estimatedCalls.map(call => {
            return {
                expectedDeparture: call.expectedDepartureTime,
                line: call.serviceJourney.journeyPattern.line.name,
                realtime: call.realtime,
            };
        })
    );
};

const updateDynamoDB = async expectedDepartureTimes => {
    const params = {
        Item: {
            StopPlace: "Vippetangen",
            Times: expectedDepartureTimes,
        },
        TableName: "DepartureTime",
    };
    return dynamoDB.put(params).promise();
};
