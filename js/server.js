"use strict";
var pages = ["index", "inventory_setup", "sql_add_objects", "settings"];
var unitlist = ["mm", 0.1, "cm", 1, "dm", 10, "m", 100]

var ip_connections = [];

var sql = require("./sql")();
var fs = require('fs');

var file = preparefile(__dirname + '/../settings.txt');

if (file[1] != "0.0.0.0") {
    var ip = file[1]
} else {
    var _ = require('underscore'); var ip = _.chain(require('os').networkInterfaces()).values().flatten().filter(function (val) { return (val.family == 'IPv4' && val.internal == false) }).pluck('address').first().value();
}
var ip = "192.168.178.29";
var http = require('http');

var server_port1 = process.env.PORT || 4466//|| file[2];
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
        if (path == 'favicon.ico') {
            res.writeHead(202, {
                'Content-Type': 'image/png'
            });
            fs.readFile(__dirname + "/../favicon.png", function (err, data) {
                res.write(data);
            });
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
        fs.readFile(__dirname + '/../_css/' + path, function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.write(data);
            res.end();
        });

    }
}

var server1 = http.createServer(fserverhandler);
var io1 = require('socket.io')(server1); // initiate socket.io server
server1.listen(server_port1, ip);
console.log("Server1 is listening on " + ip + ":" + server_port1);
io1.on('connection', (data) => {
    iohandle(data);
});

if (file[3] === 'true') {
    var server2 = http.createServer(fserverhandler);
    var io2 = require('socket.io')(server2); // initiate socket.io server
    server2.listen(server_port2, file[4]);
    console.log("Server2 is listening on " + file[4] + ":" + server_port2);
    io2.on('connection', (data) => {
        reload_data();
        iohandle(data);
    });
}

sql.setdata(pages, unitlist);
sql.initDB(true);

var rows;
var stats;
var instructions;
var box;
var item;
var unit
var unused_item;
var unused_box;
reload_data();

function reload_data() {

    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM item WHERE id NOT IN(SELECT item_id FROM item_box) ORDER BY name ASC", function (data) {
            unused_item = data;
        });
    });

    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM box WHERE box_group_id ='' ORDER BY name ASC", function (data) {
            unused_box = data;
        });
    });

    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM HTML_pages", function (data) {
            rows = data;
            stats = data;
        });
    });


    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM instructions ORDER BY name ASC", function (data) {
            instructions = data;
        });
    });


    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM box ORDER BY name ASC", function (data) {
            box = data;
        });
    });


    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM item ORDER BY name ASC", function (data) {
            console.log(data);
            item = data;
        });
    });

    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM unit ORDER BY id ASC", function (data) {
            unit = data;
        });
    });
}

function iohandle(socket) {
    var address = socket.handshake.address;
    if (!ip_connections.includes(address)) {
        console.log('connected client!; ip: ' + address);
        ip_connections += address;
    }
    socket.emit('getitem', item);
    socket.emit('getbox', box);
    socket.emit('unused_getitem', unused_item);
    socket.emit('unused_getbox', unused_box);
    socket.emit('getinstructions', instructions);
    socket.emit('rows', rows);
    socket.emit('stats', stats);
    socket.emit('getsettings', file);
    socket.emit('getUnit', unit);
    socket.on('box_data', (data) => { addbox(data); });
    socket.on('item_data', (data) => { additem(data); });
    socket.on('refresh', (data) => { reload_data(); socket.emit('reloaded', data); });
    socket.on('setsettings', (data) => { setsettings(data); });
    socket.on('disconnect', function () {
    });
}

function addbox(data) {
    let d;
    d += data[0];
    d += data[1];
    sql.insert("INSERT OR IGNORE INTO box (name, box_group_id) VALUES (?, ?)", d, () => {
        sql.read(data, "SELECT * FROM box WHERE name =" + data[0] + " AND box_group_id =" + data[1] + "", function (da) {
            console.log(da);
            for (let i = 0; i < data[2]; i += 2) {
                let dat;
                dat += data[2][i]
                dat += da.id;
                dat += data[2][i + 1];
                sql.insert("INSERT OR IGNORE INTO item (item_id, box_id, quantity) VALUES (?, ?, ?)", dat, reload_data());
            }
        });
    });
}

function additem(data) {
    sql.insert("INSERT OR IGNORE INTO item (name, instructions_id, size) VALUES (?, ?, ?)", data, reload_data());
}

function setsettings(data) {
    var setsettings = [
        (data[0] = !'') ? data[0] : file[0],
        (data[1] = !'') ? data[1] : file[1],
        (data[2] = !'') ? data[2] : file[2],
        (data[3] = !'') ? data[3] : file[3],
        (data[4] = !'') ? data[4] : file[4],
        (data[5] = !'') ? data[5] : file[5],];

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