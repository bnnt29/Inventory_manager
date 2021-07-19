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
    var used = false;

    if (path.indexOf('.html') != -1 && !used) {
        used = true;
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
            used = true;
            res.writeHead(404);
            res.write("opps this doesn't exist - 404");
            res.end();
        }
    }
    if (path.indexOf('.ico') != -1 && !used) {
        used = true;
        if (path == 'favicon.ico') {
            res.writeHead(202, {
                'Content-Type': 'image/png'
            });
            fs.readFile(__dirname + "/../favicon.png", function (err, data) {
                res.write(data);
                res.end();
            });
        }
    }

    if (path.indexOf('.jpg') != -1 && !used) {
        used = true;
        res.writeHead(202, {
            'Content-Type': 'image/jpg'
        });
        fs.readFile(__dirname + "/../_img/" + path, function (err, data) {
            res.write(data);
            res.end();
        });
    }

    if (req.url.indexOf('.js') != -1 && !used) { //req.url has the pathname, check if it conatins '.js'
        used = true;
        fs.readFile(__dirname + '/' + path, function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.write(data);
            res.end();
        });
    }

    if (req.url.indexOf('.css') != -1 && !used) { //req.url has the pathname, check if it conatins '.css'
        used = true;
        fs.readFile(__dirname + '/../_css/' + path, function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.write(data);
            res.end();
        });
    }
    if (path.indexOf("item") != -1 && !used) {
        used = true;
        fs.readFile(__dirname + '/../html/item.html', function (error, data) {
            if (error) console.error(error);
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
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
    reload_data();
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
var rows;
var stats;
var instructions;
var box;
var item;
var unit
var unused_item;
var unused_box;
var boxgroup;
var boxgroupname;

sql.setdata(pages, unitlist);
sql.initDB(true, () => { reload_data(); });

function reload_data() {
    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM box_group", function (data) {
            boxgroup = data;
        });
    });

    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM box_group ORDER BY name ASC", function (data) {
            boxgroupname = data;
        });
    });

    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM item " + /*"WHERE id NOT IN(SELECT item_id FROM item_box)" + */"ORDER BY name ASC", function (data) {
            unused_item = data;
        });
    });

    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM box " + "WHERE box_group_id IS NULL" + " ORDER BY name ASC", function (data) {
            unused_box = data;
        });
    });

    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM HTML_pages ORDER BY position ASC", function (data) {
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
            item = data;
        });
    });

    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM unit ORDER BY multiplicator ASC", function (data) {
            unit = data;
        });
    });
}
var in_use_box_node_data = [];

function iohandle(socket) {
    var address = socket.handshake.address;
    if (!ip_connections.includes(address)) {
        console.log('connected client!; ip: ' + address);
        ip_connections += address;
    }
    socket.emit('getitem', item);
    socket.emit('getbox', box);
    socket.emit('getboxgroup', boxgroup);
    socket.emit('getboxgroupname', boxgroupname);
    socket.emit('unused_getitem', unused_item);
    socket.emit('unused_getbox', unused_box);
    socket.emit('getinstructions', instructions);
    socket.emit('rows', rows);
    socket.emit('stats', stats);
    socket.emit('getsettings', file);
    socket.emit('getUnit', unit);
    socket.on('getItem_data', (data) => { sql.recreateDb((db) => { sql.read(db, "SELECT i.name item_name, instructions_id, i.size, i.total_quantity, ib.box_id, b.name box_name, b.box_group_id, bg.name bg_name, bg.location bg_location, b.color box_color, i.color color, i.picture picture, bg.color bg_color, ib.quantity quantity FROM item i LEFT JOIN (item_box ib LEFT JOIN (box b LEFT JOIN box_group bg ON b.box_group_id=bg.id) ON ib.box_id = b.id) ON i.id = ib.item_id WHERE i.id='" + data + "'", (dat) => { socket.emit(data, dat); }); }); });
    socket.on("sql_read", (data) => { sql.recreateDb((db) => { sql.read(db, data, (dat) => { socket.emit(data, dat); }); }); });
    socket.on("in_use_box_node", (data) => { in_use_box_node_data = [...in_use_box_node_data, data]; in_use_box_node_data.forEach((values) => { getbox_node_items(values, socket); }); });
    socket.on('box_data', (data) => { addbox(data); socket.emit("successb", true); });
    socket.on('box_group_data', (data) => { addboxgroup(data); socket.emit("successbg", true); });
    socket.on('item_data', (data) => { additem(data); socket.emit("successi", true); });
    socket.on('refresh', (data) => { reload_data(); socket.emit('reloaded', data); });
    socket.on('setsettings', (data) => { setsettings(data); });
    socket.on('disconnect', function () {
    });
}

function getbox_node_items(values, socket) {
    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM item_box ib LEFT JOIN item i ON ib.item_id = i.id WHERE ib.box_id='" + values + "' ORDER BY i.name ASC", function (data) {
            socket.emit("" + values, data);
        });
    });
}

function addbox(data) {
    console.log("true");
    let d = [data[0], data[1], data[3]];
    sql.insert("INSERT OR IGNORE INTO box (name, box_group_id, color) VALUES (?, ?, ?)", d, (callback) => {
        sql.recreateDb((db) => {
            sql.read(db, "SELECT * FROM box WHERE name = '" + data[0] + "'", (da) => {
                var b = false;
                da.forEach((values) => {
                    if (!b) {
                        for (let i = 0; i < data[2].length; i += 2) {
                            let dat = [data[2][i], parseInt(values.id), data[2][i + 1]];
                            if (dat[2] != 0) {
                                sql.insert("INSERT OR IGNORE INTO item_box (item_id, box_id, quantity) VALUES (?, ?, ?)", dat, (callback) => {
                                    reload_data();
                                });
                            }
                        }
                        b = true;
                    }
                    if (data[5] != 0) {
                        fs.writeFile(__dirname + "/../_img/" + values.id + ".jpg", Buffer.from(data[4][0]), function (err) {
                            if (err) throw err;
                            let da = [];
                            sql.insert("UPDATE box SET picture ='" + values.id + ".jpg" + "' WHERE id = '" + values.id + "'", da, (w) => { });
                        });
                    }
                });
            });
        });
    });
}

function addboxgroup(data) {
    let d = [data[0], data[1], data[3]];
    sql.insert("INSERT OR IGNORE INTO box_group (name, location, color) VALUES (?, ?, ?)", d, (callback) => {
        sql.recreateDb((db) => {
            sql.read(db, "SELECT * FROM box_group WHERE name = '" + data[0] + "'", (da) => {
                var b = false;
                da.forEach((values) => {
                    if (!b) {
                        for (let i = 0; i < data[2].length; i++) {
                            let dat = [];
                            sql.insert("UPDATE box SET box_group_id ='" + values.id + "' WHERE id = '" + parseInt(data[2][i]) + "'", dat, (callback) => {
                                reload_data();
                            });
                        }
                        b = true;
                    }
                    if (data[5] != 0) {
                        fs.writeFile(__dirname + "/../_img/" + values.id + ".jpg", Buffer.from(data[4][0]), function (err) {
                            if (err) throw err;
                            let da = [];
                            sql.insert("UPDATE box SET picture ='" + values.id + ".jpg" + "' WHERE id = '" + values.id + "'", da, (w) => { });
                        });
                    }
                });
            });
        });
    });
}

function additem(data) {
    let dat = [data[0], data[1], data[2], data[5], data[3]];
    sql.insert("INSERT OR IGNORE INTO item (name, instructions_id, size, total_quantity, color) VALUES (?, ?, ?, ?, ?)", dat, (q) => {
        reload_data();
        if (data[6] != 0) {
            sql.recreateDb((db) => {
                sql.read(db, "SELECT * FROM item WHERE name ='" + data[0] + "'", (datas) => {
                    datas.forEach((values) => {
                        fs.writeFile(__dirname + "/../_img/" + values.id + ".jpg", Buffer.from(data[4][0]), function (err) {
                            if (err) throw err;
                            let da = [];
                            sql.insert("UPDATE item SET picture ='" + values.id + ".jpg" + "' WHERE id = '" + values.id + "'", da, (w) => { });
                        });
                    });
                });
            });
        }
    });
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