# Installasjon

```
brew install node
brew install npm
npm install claudia -g
```

---

# Lage prosjekt

```shell
yarn init
yarn add moment
yarn add aws
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
