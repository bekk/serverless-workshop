# Serverless workshop

Velkommen til serverless workshop!

# Oppgave 1

I denne oppgaven skal dere integrere med en-tur for å hente de fem neste avgangstidene fra Vippetangen.

Brukernavn, passord og lignende til AWS finner dere [her](https://docs.google.com/spreadsheets/d/1V8LzTbTflFzzFnD2Opz24lKQOuRJd7UFMHfwCU2t61M/edit?usp=sharing).

---

Det første dere må gjøre er å opprette en tabell i [DynamoDB](https://aws.amazon.com/dynamodb). Husk hva dere kaller tabellen :)

For å sette i gang må dere klone dette repositoryet og sjekke ut branch `oppgave1`.
Deretter går dere til katalogen Terminal og skriver:

```shell
yarn global add claudia
yarn install
```

I tillegg må dere sette opp aws-credentials. Filen `~/.aws/credentials` skal se slik ut:

```ini
[default]
aws_access_key_id = <Access Key>
aws_secret_access_key = <Secret Access Key>
```

---

Da er det på tide å begynne å programmere.

Spørringen til En-tur ser slik ut:

```javascript
const query = `{stopPlace(id: \"NSR:StopPlace:4227\") {id name estimatedCalls(startTime: \"${moment().format()}\", timeRange: 72100, numberOfDepartures: 10) { realtime aimedArrivalTime aimedDepartureTime expectedArrivalTime expectedDepartureTime actualArrivalTime actualDepartureTime date forBoarding forAlighting destinationDisplay { frontText } quay {   id } serviceJourney {   journeyPattern {     line {  id  name  transportMode     }   } }    }}}`;
```

For å integrere med en-tur kan dere gjøre det slik:

```JavaScript
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
```

Strukturen på dataene fra en-tur er litt slitsom. En enkel måte å hente ut det vi er ute etter er dette:

```JavaScript
const expectedDepartureTimes = json.data.stopPlace.estimatedCalls.map(call => {
    return {
        expectedDeparture: call.expectedDepartureTime,
        line: call.serviceJourney.journeyPattern.line.name,
        realtime: call.realtime,
    };
})
```

For å skrive til DynamoDB bruker vi DocumentClient fra aws-sdk.
Syntaxen for å skrive til databasen er slik:

```javascript
const params = {
    Item: {
        StopPlace: "Vippetangen",
        Times: expectedDepartureTimes,
    },
    TableName: "DepartureTime",
};
return dynamoDB.put(params).promise();
```

Dersom du har fått til alt dette, kan du deploye og teste lambdaen.

For å installere skriver du:

```shell
claudia create --region eu-west-3 --handler entur-api-reader.handler
```

For å oppdatere skriver du:

```shell
claudia update
```

For å teste skriver du:

```shell
claudia test-lambda
```

Til slutt må du lage en scheduler som sørger for at buss-tidene i databasen blir oppdatert. Det gjør du ved å kjøre følgende kommando:

```shell
claudia add-scheduled-event \
--rate "5 minutes" \
--event event.json
```

# Oppgave 2

Nå har dere en database som jevnlig blir oppdatert med nye data om buss-avganger, så da er det på tide å tilgjengeliggjøre disse dataene gjennom et api.

For å lage et api med claudia må du installere `claudia-api-builder`:

```shell
yarn add claudia-api-builder
```

---

Gå til katalogen `oppgave2` og åpne filen `api.js`.

For å lage et api-punkt skriver man f.eks:

```javascript
api.get("/ping", async () => {
    return "pong";
});
```

For å lese data fra dynamoDB kan man enten bruke `documentClient.get` for å hente et spesifikt data-element, eller `documentClient.scan` for å søke. I dette tilfelle bruker vi `documentClient.get`.

En måte å gjøre dette på er:

```JavaScript
const params = {
    TableName: "DepartureTime",
    Key: {
        StopPlace: "Vippetangen",
    },
};

const data = await dynamoDB.get(params).promise();
```

Når funksjonen er klar må den deployes til AWS. Det gjøres slik:

```shell
claudia create \
  --name <brukernavn>-api \
  --region eu-west-3 \
  --api-module api \
  --policies policies
```

Når du har kommet hit og testet at api-et funker kan du gå videre til neste oppgave.
