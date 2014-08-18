[![Build Status](https://travis-ci.org/twinlabs/forum.svg?branch=master)](https://travis-ci.org/twinlabs/forum)

Persistent Tests:
=================
`npm run-script test:watch`

Run App:
========
`npm start`

Debug App:
==========
`npm run-script start:debug`

Run Test Suite:
===============
`npm test`

Run Test Suite in Debug Mode:
=============================
`npm run-script test:debug`

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

Migrations:
===========

Sequelize _might_ give us the tools that we need to
[set up a database in code](http://sequelizejs.com/docs/1.7.8/models#database-synchronization),
but it's possible that we'll need to do migrations manually.

Here's how the manual approach could work:

1. Create a `.sql` file in `/db/`
2. `psql -d {dbname} -a -f db/{filename}.sql`
