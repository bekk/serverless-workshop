# serverless-workshop

# Bonusoppgaver

## Frontend til S3

Simple Storage Service (S3) er en filhostingtjeneste fra AWS. I en moderne webapplikasjon, med statisk frontend med REST-API som backend, kan frontenden hostes på S3.

Først må vi bygge frontenden vår slik at den kan deployes til S3.

- I github repoet, naviger til mappen `frontend`
- Kjør kommandoen `npm run build`

Da er frontenden bygget og vi er klare til å opprette og konfigurere en S3-bøtte.

- Naviger til S3 i AWS sitt konsoll.
- Klikk `Create Bucket` for å opprette en ny S3 bøtte.
- Skriv inn et valgfritt navn i `Bucket Name` og trykk på `Create`.
- Last opp alle filene som ligger i katalogen `frontend/build`. Husk å få med mappen `static`. Det enkleste er å dra filene over.
- Velg fanen `Properties` og trykk på `Static website hosting`.
- Velg `Use this bucket to host a website` og skriv `index.html` som `index document`.
- Trykk `Save`.
- Velg fanen `Overview`, velg alle filene og mappene du har lastet opp og klikk på `More` og `Make public`.

Da er bøtten ferdig konfigurert og den skal være tilgjengelig på adressen: `http://<bucket-name>.s3-website-<region>.amazonaws.com/` f.eks: `http://entur-sanntid.s3-website-eu-west-1.amazonaws.com/`
