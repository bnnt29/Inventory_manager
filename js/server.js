"use strict";
var pages = ["index", "inventory_setup", "sql_add_objects", "settings"];

var sql = require("./sql")();
var fs = require('fs');

var file = preparefile(__dirname + '/../settings.txt');

if (file[1] != "0.0.0.0") {
    var ip = file[1]
} else {
    var _ = require('underscore'); var ip = _.chain(require('os').networkInterfaces()).values().flatten().filter(function (val) { return (val.family == 'IPv4' && val.internal == false) }).pluck('address').first().value();
}

var http = require('http');

var server_port1 = process.env.PORT || file[2];
var server_port2 = process.env.PORT || file[5];

var url = require('url');


function preparefile(file) {
    let settings_file = fs.readFileSync(file, "utf-8").toString().split(/\r?\n/);
    settings_file.forEach(function (s) {
        if (s.startsWith("//")) remove(settings_file, s);
    });
    remove(settings_file, "");
    return settings_file;
}

function remove(arr, what) {
    var found = arr.indexOf(what);

    while (found !== -1) {
        arr.splice(found, 1);
        found = arr.indexOf(what);
    }
}

function fserverhandler(req, res) {
    var path = url.parse(req.url).pathname;

    if (path != '') {
        let tmp = path.split('');
        tmp = tmp.slice(1, path.length);
        path = tmp.join('');
    }

    if (path == '' || path == 'html') {
        path = pages[0] + '.html';
    }

    if (pages.includes(path)) {
        path += ".html";
    }

    if (path.indexOf('.html') != -1) {
        if (pages.includes(path.substring(0, path.length - 5)) || pages.includes(path)) {
            let pageset = false;
            for (var i = 0; i < pages.length; i++) {
                let page = pages[i];
                if (page == path || page + '.html' == path) {
                    if (!pageset) {
                        pageset = true;
                        fs.readFile(__dirname + '/../html/' + page + '.html', function (error, data) {
                            if (error) console.error(error);
                            res.writeHead(200, {
                                'Content-Type': 'text/html'
                            });
                            res.write(data);
                            res.end();
                        });
                    }
                }
            }
        } else {
            res.writeHead(404);
            res.write("opps this doesn't exist - 404");
            res.end();
        }
    }

    if (path.indexOf('.ico') != -1) {
        if (path == '/favicon') {
            res.writeHead(202, {
                'Content-Type': 'image/png'
            });
            res.write(__dirname + ".././favicon.ico");
        }
    }

    if (req.url.indexOf('.js') != -1) { //req.url has the pathname, check if it conatins '.js'
        fs.readFile(__dirname + '/' + path, function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.write(data);
            res.end();
        });

    }

    if (req.url.indexOf('.css') != -1) { //req.url has the pathname, check if it conatins '.css'
        fs.readFile(__dirname + '/../css/' + path, function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.write(data);
            res.end();
        });

    }
}

function password() {

}

var server1 = http.createServer(fserverhandler);
var io1 = require('socket.io')(server1); // initiate socket.io server
server1.listen(server_port1, ip);
console.log("Server1 is listening on " + ip + ":" + server_port1);
io1.on('connection', iohandle);

if (file[3] === 'true') {
    var server2 = http.createServer(fserverhandler);
    var io2 = require('socket.io')(server2); // initiate socket.io server
    server2.listen(server_port2, file[4]);
    console.log("Server2 is listening on " + file[4] + ":" + server_port2);
    io2.on('connection', iohandle);
}

sql.setpages(pages);
sql.initDB(true);

var rows;
sql.recreateDb(function (data) {
    sql.read(data, "SELECT * FROM HTML_pages", function (data) {
        rows = data;
    });
});

var stats;
sql.recreateDb(function (data) {
    sql.read(data, "SELECT HTML_id, name FROM HTML_pages", function (data) {
        stats = data;
    });
});

function iohandle(socket) {
    var address = socket.handshake.address;
    console.log('connected client!; ip: ' + address);
    socket.emit('rows', rows);
    socket.emit('stats', stats);
    socket.emit('getsettings', file);
    socket.on('setsettings', (data) => { setsettings(data); });
    socket.on('disconnect', function () {
    });
}

function setsettings(data) {
    var setsettings = [
        data[0] = !'' ? data[0] : file[0],
        data[1] = !'' ? data[1] : file[1],
        data[2] = !'' ? data[2] : file[2],
        data[3] = !'' ? data[3] : file[3],
        data[4] = !'' ? data[4] : file[4],
        data[5] = !'' ? data[5] : file[5],];

    let settings_file = fs.readFileSync(__dirname + '/../settings.txt', "utf-8").toString().split(/\r?\n/);
    let i = 0;
    console.log(settings_file);
    console.log(setsettings);
    settings_file.forEach(function (s) {
        if (!s.startsWith("//")) {
            settings_file.splice(i, 1, setsettings[i]);
            i += 1;
        }
    });
    console.log(settings_file);

    // fs.unlink("settings.txt", function (err) {
    //     if (err) throw err;
    // });

    // fs.writeFile("settings.txt", settings_file, function (err) {
    //     if (err) throw err;
    // });
}
