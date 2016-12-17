[![Build Status](https://travis-ci.org/twinlabs/forum.svg?branch=master)](https://travis-ci.org/twinlabs/forum)

Persistent Tests:
=================
`npm run test:watch`

Run App:
========
`npm start`

Debug App:
==========
`npm run start:debug`

Run Test Suite:
===============
`npm test`

Run Test Suite in Debug Mode:
=============================
`npm run test:debug`

Database
========

```
psql --command="create database forum;" && psql --echo-all --dbname=forum --file=tables.sql
```

Hot Reload
==========
`npm run start` does 'hot reloading' by default. This is subject to change.
