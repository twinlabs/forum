require('./lib/helpers');

var express = require('express');
var http = require('http');
var app = express();
var session = require('express-session');
var lessMiddleware = require('less-middleware');
var autoprefixer = require('autoprefixer-core');
var httpServer = http.createServer(app);
var passport = require('passport');

rootRequire('config/environments')(app);
app.set('io', require('socket.io').listen(httpServer));

app.use(express.cookieParser());
app.use(express.session({secret: app.get('sessionSecret') || 'w!** *1*h'}));
rootRequire('lib/authentication');
app.use(passport.initialize());
app.use(passport.session());

app.use(express.bodyParser());

rootRequire('config/routes')(app, passport);

var clientConstants = {
    socketAddress: app.get('hostName')
};

app.locals.clientConstants = JSON.stringify(clientConstants);

app.engine('jade', require('jade').__express);
app.set('views', process.cwd() + '/app/views');
app.set('view engine', 'jade');
app.locals.basedir = process.cwd() + '/app/views';
app.use('/templates/post', express.static(__dirname + '/app/views/posts/'));

app.use(lessMiddleware(__dirname + '/app/assets', {
  postprocess: {
    css: function(css, request){
      return autoprefixer.process(css).css;
    }
  }
}));

app.use(express.static(__dirname + '/app/assets'));

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

app.locals.marked.setOptions({
  emoji: function (emoji) {
    return '<img src="'
        + 'http://cloud.ahfr.org/images/emoji/'
        + encodeURIComponent(emoji)
        + '.png"'
        + ' alt=":'
        + escape(emoji)
        + ':"'
        + ' title=":'
        + escape(emoji)
        + ':"'
        + ' class="emoji" align="absmiddle" height="20" width="20">';

  }
});
