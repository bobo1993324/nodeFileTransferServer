var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");

var localFileRoot = "/home/luke" //TODO make argument
var portNumber = 8888 //TODO make argument

http.createServer(function(request, response)  {
    var urlParsed = url.parse(request.url, true);
    console.log(JSON.stringify(urlParsed));
    if (urlParsed.pathname === "/api/list") {
        var dirPath = path.join(localFileRoot, urlParsed.query.path);
        fs.readdir(dirPath, function(err, files) {
            response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
            var returnFiles = [];
            for (var i in files) {
                var fileObject = {name: files[i]};
                var stats = fs.statSync(dirPath + "/" + files[i]);
                fileObject.isDirectory = stats.isDirectory();
                returnFiles.push(fileObject);
            };
            response.write(JSON.stringify(returnFiles));
            response.end();
        }) ;
    } else {
        //http website server
        fs.readFile("./" + urlParsed.pathname, function(err, data) {
            if (err) {
                response.writeHead(404);
            } else {
                response.writeHead(200, {"Content-Type": "text/html"});
                response.write(data);
            }
            response.end();
        })
    }
}).listen(portNumber);