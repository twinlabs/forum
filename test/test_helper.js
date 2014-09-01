if (process.env.NODE_ENV === 'test') {
  process.env.DATABASE_URL = "postgres://postgres@localhost/forum_test";
}

require('../lib/helpers');

