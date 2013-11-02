var express = require('express');
var app = express();

var PORT = process.argv[2] || 3000;

app.listen(PORT);
console.log('listening on port ' + PORT);
