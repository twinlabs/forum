var application_helper = require('./lib/helpers');

var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var http = require('http');
var app = express();
var session = require('express-session');
var multer = require('multer');
var httpServer = http.createServer(app);
var passport = require('passport');
var pg = require('pg');
var pgSession = require('connect-pg-simple')(session);
var postcssMiddleware = require('postcss-middleware');
var cssnext = require('postcss-cssnext');

rootRequire('config/environments')(app);
app.set('io', require('socket.io').listen(httpServer));

var conString = process.env.DATABASE_URL || "postgres://postgres@localhost/forum";

var Sequelize = require('sequelize');
var sequelize = new Sequelize(conString);

app.use(compression());
app.use(cookieParser());
app.use(session({
  store: new pgSession({
    pg: pg,
    conString: conString,
    tableName: 'session'
  }),
  secret: app.get('sessionSecret') || 'w!** *1*h',
  cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 }, // 1 year
  resave: false,
  saveUninitialized: false
}));
rootRequire('lib/authentication');
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer());

rootRequire('config/routes')(app, passport);
require('./config/socketRoutes')(app);

var clientConstants = {
    socketAddress: ''
};

app.locals.clientConstants = JSON.stringify(clientConstants);

app.engine('ejs.html', require('ejs').renderFile);
app.engine('html', require('ejs').renderFile);
app.set('views', process.cwd() + '/templates');
app.set('view engine', 'ejs.html');

app.use(postcssMiddleware({
  src: function(request) {
    return `${__dirname}/${request.path}`;
  },
  plugins: [cssnext]
}));

app.use(express.static(__dirname + '/assets'));
app.use('/stylesheets', express.static(__dirname + '/stylesheets'));
app.use(express.static(__dirname + '/build'));

module.exports = {
  server: httpServer.listen(app.get('PORT'), function(){
    console.log('listening on port ' + app.get('PORT'));
  }),
  io: app.get('io'),
  app: app,
  port: app.get('PORT')
};

var rest = require('epilogue');

rest.initialize({
  app: app,
  sequelize: sequelize
});

var checkAuth = function(req, res, context) {
  if (req.session.user.id) {
    context.continue();
  } else {
    res.json(403, { error: "Not logged in" });
    context.stop();
  }
};

rootRequire('controllers/UserApi')(rest, checkAuth);
rootRequire('controllers/TopicApi')(rest, checkAuth);
rootRequire('controllers/PostApi')(rest, checkAuth);

