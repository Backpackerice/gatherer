var fs = require('fs'),
    http = require('http'),
    express = require('express'),
    compress = require('compression'),
    port = 8000,
    app = express();

app.use(compress());
app.use(express.static(__dirname + '/build'));

app.listen(port, function () { console.log('Serving at http://localhost:' + port); });