if (process.env.NODE_ENV === 'test') {
  process.env.FORUM_DATABASE_URL = "postgres://postgres@localhost/forum_test";
}

require('../lib/helpers');

var jsdom = require('jsdom').jsdom;

var exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});
