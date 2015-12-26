var koa = require('koa'),
    routing = require('koa-routing'),
    serve = require('koa-static');
var parse = require('co-busboy');
var fs = require('fs');
var zlib = require('zlib');
var JSONStream = require('JSONStream');
var gunzip = zlib.createGunzip();

var app = koa();
app.use(serve('static'));
app.use(routing(app));

app.route('/upload').post(upload);

function *upload(next) {
    var parts = parse(this);
    var part;
    var counter = 0;

    while (part = yield parts) {
        if (!part.length) {
            part
                .pipe(gunzip)
                .pipe(JSONStream.parse('*'))
                .on('data', function(chunk) {
                    counter++;
                    console.log(JSON.stringify(chunk) + '\n');
                }).on('end', function() {
                    console.log(counter);
                });
        }
    }

    yield next;
}

app.listen(3000);
/*
 var fs = require('fs');
 var zlib = require('zlib');
 var JSONStream = require('JSONStream');

 var gunzip = zlib.createGunzip();
 var rstream = fs.createReadStream('events.json.gz');

 rstream
 .pipe(gunzip)
 .pipe(JSONStream.parse('*'))
 .on('data', function(chunk) {
 console.log(chunk + '\n');
 });*/
