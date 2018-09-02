# Oppgaver

![inline](claudia-logo-letters-500.png)

---

# Installasjon

På forhånd skal dere ha installert `yarn` og `node`.

```
yarn global add claudia
```

---

# Lage prosjekt

```shell
yarn init
yarn add moment
yarn add aws-sdk
yarn add node-fetch

vi hente-entur-data.js
```

JavaScript:

```javascript
exports.handler = () => {};
```

---

# `~/.aws/credentials`

```ini
[default]
aws_access_key_id = <Access Key>
aws_secret_access_key = <Secret Access Key>
```

---

# Installasjon

```shell
claudia create --region eu-west-3 \
--handler entur-api-reader.handler \
--timeout 120
```

## Oppdatere og teste

```shell
claudia update
claudia test-lambda
```

---

## Sette opp trigger

```shell
claudia add-scheduled-event \
--name hent-buss-tider \
--rate "5 minutes" \
--event event.json
```

---

# Oppgaver

---

# Oppgave 1

*   Finne de neste avgangene fra Vippetangen
*   Lagre dem i DynamoDB i en Lambda som henter data hvert 5. minutt

Klon [github.com/bekk/serverless-workshop](https://github.com/bekk/serverless-workshop) for å begynne

---

# Lage api

---

# Oppsett

```shell
yarn add claudia-api-builder

vi api.js
```

---

# Kode

```javascript
const ApiBuilder = require("claudia-api-builder");
const api = new ApiBuilder();

api.get("/ping", async () => {
    return "pong";
});

module.exports = api;
```

---

# Deployment

```shell
claudia create \
  --region eu-west-3 \
  --api-module api \
  --policies policies
```

---

*   Hente dem ut fra DynamoDB i en Lambda som kjører i API Gateway
*   Vise dem i et brukergrensesnitt
*   Evt bonusoppgaver

---

# Valgfrie oppgaver

*   Implementer tilsvarende for et annet stoppested eller område. ([Sjekk en-tur](https://en-tur.no/travel-detail?sj=RUT:ServiceJourney:60-108833-11872569,null,RUT:ServiceJourney:5-103401-11177748&startName=Lundliveien,%20Oslo&startId=NSR:StopPlace:5933&startCoords=59.93592,10.81123&stopName=Stortinget,%20Oslo&stopId=NSR:StopPlace:4029&stopCoords=59.913437,10.743256&modes=bus,tram,rail,metro,water,air,flytog,foot,coach&timeMode=departAfter&date=2018-08-31T08:43:27.597Z))
*   Lag en lambda som trigges hver gang databasen er oppdatert
*   Lag en tjeneste som sender deg sms 5 minutter før bussen går.
