# Serverless workshop

Velkommen til serverless workshop!

# Oppgave 1

I denne oppgaven skal dere integrere med en-tur for å hente de fem neste avgangstidene fra Vippetangen.

Brukernavn, passord og lignende til AWS finner dere [her](https://docs.google.com/spreadsheets/d/1V8LzTbTflFzzFnD2Opz24lKQOuRJd7UFMHfwCU2t61M/edit?usp=sharing).

---

Det første dere må gjøre er å opprette en tabell i [DynamoDB](https://aws.amazon.com/dynamodb).
Finn frem til konsollet for DynamoDB og klikk "Create table" for å lage en ny tabell.

*   Gi tabellen et valgfritt navn, gjerne brukernavn-DepartureTime
*   Lag Primary (partition) key med navnet `StopPlace`, type string
*   Bruk ellers default settings

---

Klon dette repositoryet og gå til katalogen `oppgave1` i en Terminal og skriv:

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
    TableName: TABLE_NAME,
};
return dynamoDB.put(params).promise();
```

Dersom du har fått til alt dette, kan du deploye og teste lambdaen.

For å installere skriver du:

```shell
claudia create \
--region eu-west-3 \
--name <brukernavn>-reader \
--handler entur-api-reader.handler \
--policies policies
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
--event event.json \
--name <brukernavn>-schedule
```

# Oppgave 2

Nå har dere en database som jevnlig blir oppdatert med nye data om buss-avganger, så da er det på tide å tilgjengeliggjøre disse dataene gjennom et api.

Gå til katalogen `oppgave2` og kjør `yarn install`. Åpne filen `api.js`.

---

For å lage et api-punkt skriver man f.eks:

```javascript
api.get("/Vippetangen", async () => {
    return "pong";
});
```

For å lese data fra dynamoDB kan man enten bruke `documentClient.get` for å hente et spesifikt data-element, eller `documentClient.scan` for å søke. I dette tilfelle bruker vi `documentClient.get`.

En måte å gjøre dette på er:

```JavaScript
const params = {
    TableName: TABLE_NAME,
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

# Oppgave 3

I denne oppgaven skal vi integrere en frontend applikasjon med API-et vi skrev i oppgave 2 sånn at vi faktisk får vist de ulike avgangene.

Vi har laget en enkel frontend-applikasjon for dere som viser alle avgangene som hentes fra API-et. Du må kun gjøre et par endringer for å få applikasjonen til å peke mot ditt API. Applikasjonen er satt opp til å hente nye data hvert 10. sekund.

*   Naviger til mappen `frontend`.
*   Kjør kommandoen `npm install` for å installere alle nødvendige avhengigheter.
*   Åpne filen `src/App.js` og endre verdien til `API_URL` til ditt API.
*   Kjør kommandoen `npm run start` for å starte applikasjonen.
*   Åpne `localhost:3000` og se at avgangene vises som forventet.
    Åpne [localhost:3000](http://localhost:3000) og se at avgangene vises som forventet.

# Bonusoppgaver

Er du ferdig? Bra jobba! Her er noen bonusoppgaver som du kan bryne deg på den siste tiden.

## Frontend til S3

Simple Storage Service (S3) er en filhostingtjeneste fra AWS. I en moderne webapplikasjon, med statisk frontend med REST-API som backend, kan frontenden hostes på S3.

Først må vi bygge frontenden vår slik at den kan deployes til S3.

*   I github repoet, naviger til mappen `frontend`
*   Kjør kommandoen `npm run build`

Da er frontenden bygget og vi er klare til å opprette og konfigurere en S3-bøtte.

*   Naviger til S3 i AWS sitt konsoll.
*   Klikk `Create Bucket` for å opprette en ny S3 bøtte.
*   Skriv inn et valgfritt navn i `Bucket Name` og trykk på `Create`.
*   Last opp alle filene som ligger i katalogen `frontend/build`. Husk å få med mappen `static`. Det enkleste er å dra filene over.
*   Velg fanen `Properties` og trykk på `Static website hosting`.
*   Velg `Use this bucket to host a website` og skriv `index.html` som `index document`.
*   Trykk `Save`.
*   Velg fanen `Overview`, velg alle filene og mappene du har lastet opp og klikk på `More` og `Make public`.

Da er bøtten ferdig konfigurert og den skal være tilgjengelig på adressen: `http://<bucket-name>.s3-website-<region>.amazonaws.com/` f.eks: `http://entur-sanntid.s3-website-eu-west-1.amazonaws.com/`

## Noen andre bonusoppgaver

*   Implementer tilsvarende funksjonalitet for et annet stoppested eller område.
*   Lag en lambda som trigges hver gang databasen er oppdatert.
*   Lag en tjeneste som sender deg sms 5 minutter før bussen går.
