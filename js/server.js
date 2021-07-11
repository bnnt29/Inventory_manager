"use strict";
var pages = ["index", "inventory_setup", "sql_add_item", "settings"];

var sql = require("./sql")();

var http = require('http');
var _ = require('underscore'); var ip = _.chain(require('os').networkInterfaces()).values().flatten().filter(function (val) { return (val.family == 'IPv4' && val.internal == false) }).pluck('address').first().value();
var server_port = process.env.PORT || 4466;

var io = require('socket.io')().listen(4466); // initiate socket.io server

var url = require('url');
var fs = require('fs');
function fserverhandler(req, res) {
    var path = url.parse(req.url).pathname;
    if (path == '/favicon') {
        res.writeHead(202, {
            'Content-Type': 'image/png'
        });
        res.write(__dirname + ".././favicon.ico");
    }
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
}

var server1 = http.createServer(fserverhandler);
var server2 = http.createServer(fserverhandler);
console.log("Server is listening on " + ip + ":" + server_port);

//var io = require('socket.io')(server1); // initiate socket.io server
var io = require('socket.io')(server2); // initiate socket.io server
+
    + +
    +



    sql.setpages(pages);
sql.initDB(true);

var rows;
sql.recreateDb(function (data) {
    sql.read(data, "SELECT * FROM HTML_pages", function (data) {
        rows = data;
    });
});

io.on('connection', function (socket) {
    console.log('connected socket!');
    console.log("2");
    socket.on('ready', function (data) {
        console.log("3");
        console.log(data);
    });
    socket.emit('respond', rows);
    console.log("4");
    socket.on('disconnect', function () {
        console.log("5");
        console.log('Socket disconnected');
    });
    console.log("6");
});

//server1.listen(server_port, ip);
server2.listen(server_port, '127.0.0.1');
