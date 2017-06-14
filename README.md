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

Connect to the database and add one column to the `forum_user` table:
```
alter table forum_user add column is_v2 boolean;
```

Hot Reload
==========
`npm run start` does 'hot reloading' by default. This is subject to change.

Add /build Directory
====================
From installation directory root, `mkdir build`. This directory is needed so the app can write client-side bundles to it.

Register a User
===============
After installation, point your browser at `[root installation folder]/signup`.

Choose the file `duck.jpg` from your `/test/fixtures` as your authentication token.

After registering, login using the user/pass you signed up with.
