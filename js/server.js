var pages = ["index", "inventory_setup", "sql_add_objects", "settings"];
var size_unitlist = ["mm", 0.1, "cm", 1, "dm", 10, "m", 100, "km", 1000];
var weight_unitlist = ["g", 0.001, "kg", 1, "t", 1000];

var ip_connections = [];

var sql = require("./sql")();
var fs = require('fs');

var file = preparefile(__dirname + '/../' + 'settings.txt');

var ip;
if (file[1] != "0.0.0.0") {
    ip = file[1]
} else {
    var _ = require('underscore'); ip = _.chain(require('os').networkInterfaces()).values().flatten().filter(function (val) { return (val.family == 'IPv4' && val.internal == false) }).pluck('address').first().value();
}
var http = require('http');
const ConnectionConfig = require("mysql/lib/ConnectionConfig");

var server_port1 = process.env.PORT || file[2];
var server_port2 = process.env.PORT || file[5];

var url = require('url');

function preparefile(file) {
    let settings_file = fs.readFileSync(file, "utf-8").toString().split(/\r?\n/);
    let fileda = [];
    if (settings_file != null) {
        settings_file.forEach(function (s) {
            if (s.indexOf("#") != -1) {
                let f = s.substring(1);
                fileda = [...fileda, f];
            }
        });
        return fileda;
    } else {
        console.log("Settings file has to be created manually");
    }
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
                'Content-Type': 'image/icon'
            });
            fs.readFile(__dirname + "/../favicon.ico", function (err, data) {
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

        if (path.indexOf('default') == -1) {
            fs.readFile(file[0] + '/_img/' + path, function (err, data) {
                res.write(data);
                res.end();
            });
        } else {
            fs.readFile(__dirname + "/../" + path, function (err, data) {
                res.write(data);
                res.end();
            });
        }
    }

    if (path.indexOf('.txt') != -1 && !used) {
        used = true;
        res.writeHead(202, {
            'Content-Type': 'text/txt'
        });
        fs.readFile(file[0] + "/_txt/" + path, function (err, data) {
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
    if ((path.indexOf("item") != -1 && !used) || (path.indexOf("i") != -1 && !used)) {
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

    if ((path.indexOf("bg") != -1 && !used) || (path.indexOf("box_group") != -1 && !used) || (path.indexOf("boxgroup") != -1 && !used)) {
        used = true;
        fs.readFile(__dirname + '/../html/box_group.html', function (error, data) {
            if (error) console.error(error);
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(data);
            res.end();
        });
    }

    if ((path.indexOf("box") != -1 && !used) || (path.indexOf("b") != -1 && !used)) {
        used = true;
        fs.readFile(__dirname + '/../html/box.html', function (error, data) {
            if (error) console.error(error);
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(data);
            res.end();
        });
    }

    if (!used) {
        res.writeHead(404);
        res.write("opps this doesn't exist - 404");
        res.end();
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

var html;
var instructions;
var box;
var item;
var size_unit;
var weight_unit;
var unused_item;
var unused_box;
var boxgroup;
var boxgroupname;
var documents = [];

sql.setdata(pages, size_unitlist, weight_unitlist, file[0]);
sql.initDB(() => { reload_data(); });

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
        sql.read(data, "SELECT * FROM item ORDER BY name ASC", function (data) {
            unused_item = data;
        });
    });

    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM box WHERE box_group_id IS NULL OR box_group_id='1' ORDER BY name ASC", function (data) {
            unused_box = data;
        });
    });

    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM HTML_pages ORDER BY position ASC", function (data) {
            html = data;
        });
    });


    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM instructions ORDER BY name ASC", function (data) {
            instructions = data;
            instructions.forEach((values) => {
                if (values.document == "") {
                    let a = fs.readFileSync(__dirname + "/../user_data/_txt/" + values.document).toString();
                    documents = [...documents, a, values.id];
                }
            });
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
        sql.read(data, "SELECT * FROM size_unit ORDER BY multiplicator ASC", function (data) {
            size_unit = data;
        });
    });

    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM weight_unit ORDER BY multiplicator ASC", function (data) {
            weight_unit = data;
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
    socket.emit('html', html);
    socket.emit('getsettings', file);
    socket.emit('getsize_Unit', size_unit);
    socket.emit('getweight_Unit', weight_unit);
    socket.emit('getdocuments', documents);
    socket.on('setpicture', (data) => { fs.writeFile(__dirname + "/../user_data/_img/" + data[0], Buffer.from(data[1]), function (err) { if (err) throw err; socket.emit("set_p" + data, true); }); });
    socket.on('setfile', (data) => { fs.writeFile(__dirname + "/../user_data/_txt/" + data[0], Buffer.from(data[1]), function (err) { if (err) throw err; socket.emit("set_f" + data, true); }); });
    socket.on('getfile', (data) => { let a = fs.readFileSync(__dirname + data).toString(); socket.emit("get_f" + data, a); });
    socket.on('getinstructions', (data) => { sql.recreateDb((db) => { sql.read(db, "SELECT * FROM instructions WHERE id='" + data + "'", (dat) => { socket.emit("get_inst" + data, dat); }); }); });
    socket.on('getItem_data', (data) => { sql.recreateDb((db) => { sql.read(db, "SELECT i.name item_name, instructions_id, i.size, i.weight, i.price, i.total_quantity, ib.box_id, b.name box_name, b.box_group_id, bg.name bg_name, bg.location bg_location, b.color box_color, i.color color, i.picture picture, bg.color bg_color, ib.quantity quantity FROM item i LEFT JOIN (item_box ib LEFT JOIN (box b LEFT JOIN box_group bg ON b.box_group_id=bg.id) ON ib.box_id = b.id) ON i.id = ib.item_id WHERE i.id='" + data + "' ORDER BY b.box_group_id ASC", (dat) => { socket.emit("item" + data, dat); }); }); });
    socket.on('getBox_data', (data) => { sql.recreateDb((db) => { sql.read(db, "SELECT b.weight b_weight, b.id b_id, b.name b_name, b.box_group_id bg_id, b.color b_color, b.picture b_picture, ib.item_id ib_item_id, ib.quantity ib_quantity, i.id i_id, i.name i_name, i.price i_price, i.weight i_weight, i.color i_color, i.picture i_picture FROM Box b LEFT JOIN (item_box ib LEFT JOIN item i ON ib.item_id = i.id) ON b.id = ib.box_id WHERE b.id='" + data + "' ORDER BY b.box_group_id ASC", (dat) => { socket.emit("box" + data, dat); }); }); });
    socket.on('getBoxgroup_data', (data) => { sql.recreateDb((db) => { sql.read(db, "SELECT bg.id bg_id, bg.name bg_name, bg.color bg_color, bg.picture bg_picture, bg.location bg_location, b.weight b_weight, b.id b_id, b.name b_name, b.color b_color, b.picture b_picture, ib.item_id ib_item_id, ib.quantity ib_quantity, i.id i_id, i.name i_name, i.price i_price, i.weight i_weight, i.color i_color, i.picture i_picture FROM box_group bg LEFT JOIN (box b LEFT JOIN (item_box ib LEFT JOIN item i ON ib.item_id=i.id) ON b.id = ib.box_id) ON bg.id = b.box_group_id WHERE bg.id='" + data + "' ORDER BY b.id ASC", (dat) => { socket.emit("box_group" + data, dat); }); }); });
    socket.on("sql_read", (data) => { sql.recreateDb((db) => { sql.read(db, data, (dat) => { socket.emit("sql_r" + data, dat); }); }); });
    socket.on("sql_insert", (data) => { sql.insert(data[0], data[1], () => { reload_data(); socket.emit("sql_i" + data, true); }); });
    socket.on("in_use_box_node", (data) => { in_use_box_node_data = [...in_use_box_node_data, data]; in_use_box_node_data.forEach((values) => { getbox_node_items(values, socket); }); });
    socket.on('box_data', (data) => { addbox(data); socket.emit("successb", true); });
    socket.on('box_group_data', (data) => { addboxgroup(data); socket.emit("successbg", true); });
    socket.on('item_data', (data) => { additem(data); socket.emit("successi", true); });
    socket.on('instruction_data', (data) => { addinstruction(data); socket.emit("successinst", true); });
    socket.on('refresh', (data) => { reload_data(); socket.emit('reloaded', data); });
    socket.on('setsettings', (data) => { setsettings(data); socket.emit("setsettings" + data, data); });
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
    let d = [data[0], data[1], data[3], data[6]];
    sql.insert("INSERT OR IGNORE INTO box (name, box_group_id, color, weight) VALUES (?, ?, ?, ?)", d, (callback) => {
        sql.recreateDb((db) => {
            sql.read(db, "SELECT * FROM box WHERE name = '" + data[0] + "'", (da) => {
                var b = false;
                da.forEach((values) => {
                    if (!b) {
                        for (let i = 0; i < data[2].length; i += 2) {
                            let dat = [data[2][i], parseInt(values.id), data[2][i + 1]];
                            if (dat[2] != 0) {
                                sql.recreateDb((db) => {
                                    sql.read(db, "SELECT * FROM item_box WHERE item_id='" + data[2][i] + "' AND box_id='1'", (datas) => {
                                        sql.insert("INSERT OR IGNORE INTO item_box (item_id, box_id, quantity) VALUES (?, ?, ?)", dat, (callback) => {
                                            let da = [];
                                            sql.insert("UPDATE item_box SET quantity='" + (datas[0].quantity - data[2][i + 1]) + "' WHERE item_id='" + data[2][i] + "' AND box_id='1'", da, (w) => {
                                                reload_data();
                                            });
                                        });

                                    });
                                })
                            }
                        }
                        b = true;
                    }
                    if (data[5] != 0) {
                        fs.writeFile(__dirname + "/../user_data/_img/" + "box?b=" + values.id + ".jpg", Buffer.from(data[4][0]), function (err) {
                            if (err) throw err;
                            let da = [];
                            sql.insert("UPDATE box SET picture ='" + "box?b=" + values.id + ".jpg" + "' WHERE id = '" + values.id + "'", da, (w) => { });
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
                        fs.writeFile(__dirname + "/../user_data/_img/" + "boxgroup?bg=" + values.id + ".jpg", Buffer.from(data[4][0]), function (err) {
                            if (err) throw err;
                            let da = [];
                            sql.insert("UPDATE box SET picture ='" + "boxgroup?bg=" + values.id + ".jpg" + "' WHERE id = '" + values.id + "'", da, (w) => { });
                        });
                    }
                });
            });
        });
    });
}

function addinstruction(data) {
    let d = [data[0]];
    sql.insert("INSERT OR IGNORE INTO instructions (name) VALUES (?)", d, (callback) => {
        sql.recreateDb((db) => {
            sql.read(db, "SELECT * FROM instructions WHERE name = '" + data[0] + "'", (da) => {
                var b = false;
                da.forEach((values) => {
                    if (!b) {
                        for (let i = 0; i < data[2].length; i++) {
                            let dat = [];
                            sql.insert("UPDATE item SET instructions_id ='" + values.id + "' WHERE id = '" + parseInt(data[1][i]) + "'", dat, (callback) => {
                                reload_data();
                            });
                        }
                        b = true;
                    }
                    if (data[3] != 0) {
                        fs.writeFile(__dirname + "/../user_data/_txt/" + values.id + ".txt", Buffer.from(data[2]), function (err) {
                            if (err) throw err;
                            let da = [];
                            sql.insert("UPDATE instructions SET document ='" + values.id + ".txt" + "' WHERE id = '" + values.id + "'", da, (w) => { });
                        });
                    }
                });
            });
        });
    });
}

function additem(data) {
    let quantity = data[5];
    if (quantity == null || quantity == "" || quantity == 0 || quantity == NaN) {
        quantity = 0;
    }
    let dat = [data[0], data[1], data[2], quantity, data[3], data[8], data[7]];
    sql.insert("INSERT OR IGNORE INTO item (name, instructions_id, size, total_quantity, color, price, weight) VALUES (?, ?, ?, ?, ?, ?, ?)", dat, (q) => {
        reload_data();
        if (data[6] != 0) {
            sql.recreateDb((db) => {
                sql.read(db, "SELECT * FROM item WHERE name ='" + data[0] + "'", (datas) => {
                    datas.forEach((values) => {
                        fs.writeFile(__dirname + "/../user_data/_img/" + "item?i=" + values.id + ".jpg", Buffer.from(data[4][0]), function (err) {
                            if (err) throw err;
                            let da = [];
                            sql.insert("UPDATE item SET picture ='" + "item?i=" + values.id + ".jpg" + "' WHERE id = '" + values.id + "'", da, (w) => { });
                        });
                    });
                });
            });
        }
        sql.recreateDb((db) => {
            sql.read(db, "SELECT * FROM item WHERE name ='" + data[0] + "'", (datas) => {
                datas.forEach((values) => {
                    sql.recreateDb((db) => {
                        sql.read(db, "SELECT * FROM item_box WHERE item_id ='" + values.id + "' AND Box_id='1'", (d) => {
                            if (d.length == 0) {
                                let dat = [values.id, 1, quantity];
                                sql.insert("INSERT OR IGNORE INTO item_box (item_id, box_id, quantity) VALUES (?, ?, ?)", dat, (callback) => {
                                    reload_data();
                                });
                            } else if (d.length > 1) {
                                console.log("An error occured");
                                reload_data();
                            }
                        });
                    });
                });
            });
        });
    });
}

function setsettings(data) {
    var setsettings = [
        (data[0] != '') ? ((data[0] != null) ? data[0] : file[0]) : file[0],
        (data[1] != '') ? ((data[1] != null) ? data[1] : file[1]) : file[1],
        (data[2] != '') ? ((data[2] != null) ? data[2] : file[2]) : file[2],
        data[3] + "",
        (data[4] != '') ? ((data[4] != null) ? data[4] : file[4]) : file[4],
        (data[5] != '') ? ((data[5] != null) ? data[5] : file[5]) : file[5],
        (data[6] != '') ? ((data[6] != null) ? data[6] : file[6]) : file[6]];

    let settings_file = fs.readFileSync(__dirname + '/../' + 'settings.txt', "utf-8").toString().split(/\r?\n/);
    let i = 0;
    let set = settings_file.slice();
    let a = 0;
    for (let i = 0; i < set.length; i++) {
        let s = set[i];
        if (s.indexOf('#') != -1) {
            settings_file.splice(i, 1, "#" + setsettings[a]);
            a += 1;
        }
    }
    file = setsettings;
    sql.setdata(pages, size_unitlist, weight_unitlist, file[0]);
    server1.close();
    server2.close();
    ip_connections = [];
    server_port1 = process.env.PORT || file[2];
    server_port2 = process.env.PORT || file[5];
    server1.listen(server_port1, ip);
    console.log("Server1 is listening on " + ip + ":" + server_port1);
    io1.on('connection', (data) => {
        reload_data();
        iohandle(data);
    });
    if (file[3] === 'true') {
        server2.listen(server_port2, file[4]);
        console.log("Server2 is listening on " + file[4] + ":" + server_port2);
        io2.on('connection', (data) => {
            reload_data();
            iohandle(data);
        });
    }
    fs.writeFile(__dirname + '/../' + 'settings.txt', settings_file.join('\r\n'), function (err) {
        if (err) throw err;
    });
}