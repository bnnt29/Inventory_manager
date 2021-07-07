"use strict";
var pages = ["index", "inventory_setup", "sql_add_item", "settings"];

var http = require('http');
var https = require('https');
var _ = require('underscore'); var ip = _.chain(require('os').networkInterfaces()).values().flatten().filter(function (val) { return (val.family == 'IPv4' && val.internal == false) }).pluck('address').first().value();
var server_port = process.env.PORT || 4466;

var io = require('socket.io')().listen(4466); // initiate socket.io server

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
        path = pages[0] + '.html';
    }
    if (pages.includes(path.substring(0, path.length - 5)) || pages.includes(path)) {
        let pageset = false;
        for (var i = 0; i < pages.length; i++) {
            let page = pages[i];
            if (page == path || pageset) {
            } else {
                pageset = true;
                fs.readFile(__dirname + '/../html/' + page + '.html', function (error, data) {
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

require('./sql')().setpages(pages);
require('./sql')().initDB(true);

var htdb;
require('./sql')().recreateDb(function (data) { htdb = data })
var rows;
require('./sql')().read(htdb, "SELECT * FROM HTML_pages", function(data){rows = data})
require('./sql')().closedb(htdb);
console.log(rows);

io.sockets.on('connection', function (socket) {
    socket.emit('ready', 'ready'); // Send data to client

    // wait for the event raised by the client
    socket.on('req', function (data) {
        socket.emit('pages', require('./sql')().read(require('./sql')().recreateDb(), "SELECT * FROM HTML_pages"));
    });
});