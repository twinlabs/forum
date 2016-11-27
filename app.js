var application_helper = require('./lib/helpers');

var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var http = require('http');
var app = express();
var session = require('express-session');
var lessMiddleware = require('less-middleware');
var multer = require('multer');
var postcss = require('postcss');
var httpServer = http.createServer(app);
var passport = require('passport');
var pg = require('pg');
var pgSession = require('connect-pg-simple')(session);

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

var clientConstants = {
    socketAddress: ''
};

app.locals.clientConstants = JSON.stringify(clientConstants);

app.engine('jade', require('jade').__express);
app.engine('ejs.html', require('ejs').renderFile);
app.engine('html', require('ejs').renderFile);
app.set('views', process.cwd() + '/app/views');
app.set('view engine', 'ejs.html');
app.locals.basedir = process.cwd() + '/app/views';
app.use('/templates/post', express.static(__dirname + '/app/views/posts/'));

app.use(lessMiddleware(__dirname + '/app/assets', {
  postprocess: {
    css: function(css, request){
      return postcss([require('autoprefixer')]).process(css).css;
    }
  }
}));

app.use(lessMiddleware(__dirname + '/v2', {
  postprocess: {
    css: function(css, request){
      return postcss([require('autoprefixer')]).process(css).css;
    }
  }
}));

app.use(express.static(__dirname + '/app/assets'));
app.use(express.static(__dirname + '/v2'));

module.exports = {
  server: httpServer.listen(app.get('PORT'), function(){
    console.log('listening on port ' + app.get('PORT'));
  }),
  io: app.get('io'),
  app: app,
  port: app.get('PORT')
};

app.locals.moment = require('moment');
app.locals.marked = require('marked');
app.locals.getPostDate = application_helper.getPostDate;
app.locals.isSupporter = application_helper.isSupporter;

var markedRenderer = new app.locals.marked.Renderer();
markedRenderer.link = function(href, title, text) {
  return '<a target="_blank"' +
      'href="' + href + '"' +
      (title ? 'title="' + title + '"' : '') +
    '>' + text + "</a>";
};

var lexer = new app.locals.marked.Lexer();
lexer.rules.heading = { exec: function() {} };

app.locals.marked.lexer = lexer;

app.locals.marked.setOptions({
  emoji: function (emoji) {
    return '<img src="'
        + 'https://cloud.ahfr.org/images/emoji/'
        + encodeURIComponent(emoji)
        + '.png"'
        + ' alt=":'
        + escape(emoji)
        + ':"'
        + ' title=":'
        + escape(emoji)
        + ':"'
        + ' class="emoji" align="absmiddle" height="20" width="20">';

  },
  breaks: true,
  renderer: markedRenderer
});

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

rootRequire('app/controllers/UserApi')(rest, checkAuth);
rootRequire('app/controllers/TopicApi')(rest, checkAuth);
rootRequire('app/controllers/PostApi')(rest, checkAuth);

