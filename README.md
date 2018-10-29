[![Build Status](https://travis-ci.org/twinlabs/forum.svg?branch=master)](https://travis-ci.org/twinlabs/forum)

Installation:
=============
`docker-compose build`

Persistent Tests (not yet working with Docker):
=================
`npm run test:watch`

Run App Locally:
================
`docker-compose up web`

Debug App (not yet set up):
==========
`npm run start:debug`

Run Test Suite:
===============
`docker-compose run e2e`

Run Test Suite in Debug Mode (not yet working):
=============================
`npm run test:debug`

Database
========

Created on Install step.

Register a User
===============
After installation, point your browser at `[root installation folder]/signup`.

Choose the file `duck.jpg` from your `/test/fixtures` as your authentication token.

After registering, login using the user/pass you signed up with.

Hot Reload (doesn't work yet.)
==========
`npm run start:dev` does 'hot reloading' by default. This is subject to change.

Environment Variables
=====================
`FORUM_STORAGE_ADAPTER=S3` - change this and provide another module to use your chosen storage back-end. For documentation on the default `S3` adapter, see [that module's documentation](https://www.npmjs.com/package/f.orum-storage-s3).
