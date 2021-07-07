"use strict";
var http = require('http');
var https = require('https');
var _ = require('underscore'); var ip = _.chain(require('os').networkInterfaces()).values().flatten().filter(function (val) { return (val.family == 'IPv4' && val.internal == false) }).pluck('address').first().value();
var server_port = process.env.PORT || 4466;
var url = require('url');
var fs = require('fs');
var server = http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    if (path != '') {
        let tmp = path.split('');
        tmp = tmp.slice(1, path.length);
        path = tmp.join('');
    }
    if (path == '' || path == 'html') {
        path = pages[0];
    }
    if (pages.includes(path) || page_names.includes(path)) {
        let pageset = false;
        for (var i = 0; i < pages.length; i++) {
            let page = pages[i];
            if (page != path && page_names[i] != path || pageset) {
            } else {
                pageset = true;
                fs.readFile(__dirname + '/html/' + page, function (error, data) {
                    if (error) {
                        res.writeHead(404);
                        res.write(error);
                        res.end();
                    } else {
                        res.writeHead(200, {
                            'Content-Type': 'text/html'
                        });
                        res.write(data);
                        res.end();
                    }
                });
            }
        }
        if (!pageset) {
            res.writeHead(404);
            res.write("opps this doesn't exist - 404");
            res.end();
        }
        i += 1;
    } else {
        res.writeHead(404);
        res.write("opps this doesn't exist - 404");
        res.end();
    }
});
server.listen(server_port, ip);
console.log("Server is listening on " + ip + ":" + server_port);

require('./sql')(true, null).initDB(true);