module.exports = function(app){
  app.configure('development', function(){
    app.set('hostName', 'http://localhost');
  });
};
