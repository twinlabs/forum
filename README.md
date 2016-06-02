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

Proposed Directory Structure:
=============================

```
Let's Try This:

|-- app
|   |-- controllers
|   |-- models
|   |-- views
|   `-- client
|       `-- browser
|           |-- controllers
|           |-- models
|           |-- views
|       `-- mobile
|           |-- controllers
|           |-- models
|           |-- views
`-- config
`-- lib
`-- spec
`-- vendor

https://gist.github.com/viatropos/1398757 for more

```

Database
========

The example database here is simple, iterative, and focused on being fast.

```
psql --command="create database forum;" && psql --echo-all --dbname=forum --file=tables.sql
```

Compiling Client-side Templates:
================================
Some templates are used client-side too and currently must be
compiled manually. e.g. `jade --client --no-debug app/views/posts/post.jade`

Hot Reload
==========
`npm run start` does 'hot reloading' by default. This is subject to change.
