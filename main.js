var http = require("http");
var inspect = require('util').inspect;
var url = require("url");
var path = require("path");
var fs = require("fs");
var express = require("express");
var Busboy = require('busboy');

var app = express();
var router = express.Router();

var localFileRoot = "/home/luke" //TODO make argument
var portNumber = 8888 //TODO make argument

app.use(function(req, res, next) {
    var urlParsed = url.parse(req.url, true);
    if (urlParsed.pathname.indexOf("/api/") != 0) {
        fs.readFile("./" + urlParsed.pathname, function(err, data) {
            if (err) {
                res.writeHead(404);
            } else {
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write(data);
            }
            res.end();
        });
    } else {
        next();
    }
});

app.use("/api", router);

router.get("/list", function(req, res, next) {
    var urlParsed = url.parse(req.url, true);
    var dirPath = path.join(localFileRoot, urlParsed.query.path);
    fs.readdir(dirPath, function(err, files) {
        res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
        var returnFiles = [];
        for (var i in files) {
            var fileObject = {name: files[i]};
            var stats = fs.statSync(dirPath + "/" + files[i]);
            fileObject.isDirectory = stats.isDirectory();
            returnFiles.push(fileObject);
        };
        res.write(JSON.stringify(returnFiles));
        res.end();
    });
}).post("/upload", function(req, res, next) {
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      file.on('data', function(data) {
        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
      });
      file.on('end', function() {
        console.log('File [' + fieldname + '] Finished');
      });
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    });
    busboy.on('finish', function() {
      console.log('Done parsing form!');
      res.writeHead(200, {'Content-Type': 'text/json'});
      res.end('{"message": "post received"}');
    });
    req.pipe(busboy);
});

app.listen(portNumber);