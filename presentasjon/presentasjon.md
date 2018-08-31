![inline](claudia-logo-letters-500.png)

---

# Installasjon

```
brew install node
brew install npm
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

## JavaScript

```javascript
exports.handler = () => {};
```

---

# `~/.aws/credentials`

```
[default]
aws_access_key_id = <Access Key>
aws_secret_access_key = <Secret Access Key>
```

---

# Installasjon

```
claudia create --region eu-west-3 \
--handler entur-api-reader.handler \
--timeout 120
```

## Oppdatere og teste

```
claudia update
claudia test-lambda
```

---

## Sette opp trigger

```
claudia add-scheduled-event \
--name hent-buss-tider \
--rate "5 minutes" \
--event event.json
```

---

# Lage api

---

# Oppsett

```
yarn add claudia-api-builder

vi api.js
```

---

# Kode

```
const ApiBuilder = require("claudia-api-builder");
const api = new ApiBuilder();

api.get("/ping", async () => {
    return "pong";
});

module.exports = api;
```

---

# Deployment

```
claudia create \
  --region eu-west-3 \
  --api-module api \
  --policies policies
```

---

# Valgfrie oppgaver

*   Implementer tilsvarende for et annet stoppested eller område.
*   Lag en lambda som trigges hver gang databasen er oppdatert
*   Lag en tjeneste som sender deg sms 5 minutter før bussen går.
