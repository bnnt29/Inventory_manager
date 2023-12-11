var pages = ["index", "setup", "objects", "settings"];
var size_unitlist = ["mm", 0.1, "cm", 1, "dm", 10, "m", 100, "km", 1000];
var weight_unitlist = ["g", 0.001, "kg", 1, "t", 1000];

var ip_connections = [];

var user = [];
//class for user

var sql = require("./sql")();
var fs = require('fs');
var idu = require("image-data-uri");

var file = preparefile(__dirname + '\\..\\' + 'settings.txt');

var ip;
if (file[1] != "0.0.0.0") {
    ip = file[1];
} else {
    var _ = require('underscore'); ip = _.chain(require('os').networkInterfaces()).values().flatten().filter(function (val) { return (val.family == 'IPv4' && val.internal == false) }).pluck('address').first().value();
}
var http = require('http');

var server_port1 = process.env.PORT || file[2];
var server_port2 = process.env.PORT || file[5];

var url = require('url');

function preparefile(file) {
    console.log(file);
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
                        if (openprompt(page, res, req)) {
                            pageset = true;
                            res.writeHead(200, {
                                'Content-Type': 'text/html'
                            });
                            fs.readFile(__dirname + '/../html/' + page + '.html', function (error, data) {
                                if (error) {
                                    res.writeHead(404);
                                    res.end();
                                    throw error;
                                } else {
                                    res.write(data);
                                    res.end();
                                }
                            });
                        }
                    }
                }
            }
        } else {
            used = true;
            res.write("opps this doesn't exist - 404");
            res.writeHead(404);
            res.end();
        }
    }
    if (path.indexOf('.ico') != -1 && !used) {
        used = true;
        if (path == 'favicon.ico') {
            res.writeHead(200, {
                'Content-Type': 'image/icon'
            });
            fs.readFile(__dirname + "/../favicon.ico", function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.end();
                    throw error;
                } else {
                    res.write(data);
                    res.end();
                }
            });
        }
    }

    if ((path.indexOf("png") != -1 || path.indexOf("jpg") != -1) && !used) {
        used = true;
        res.writeHead(200, { 'Content-Type': 'image' });
        fs.readFile(file[0] + "/_" + path, function (error, data) {
            if (error) {
                res.writeHead(404);
                res.end();
                throw error;
            } else {
                res.write(data);
                res.end();
            }
        });
    }

    if (path.indexOf('.txt') != -1 && !used) {
        used = true;
        res.writeHead(200, {
            'Content-Type': 'text/txt'
        });
        fs.readFile(file[0] + "/_txt/" + path, function (error, data) {
            if (error) {
                res.writeHead(404);
                res.end();
                throw error;
            } else {
                res.write(data);
                res.end();
            }
        });
    }

    if (req.url.indexOf('.js') != -1 && !used) { //req.url has the pathname, check if it conatins '.js'
        used = true;
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        fs.readFile(__dirname + '/../' + path, function (error, data) {
            if (error) {
                res.writeHead(404);
                res.end();
                throw error;
            } else {
                res.write(data);
                res.end();
            }
        });
    }

    if (req.url.indexOf('.css') != -1 && !used) { //req.url has the pathname, check if it conatins '.css'
        used = true;
        res.writeHead(200, { 'Content-Type': 'text/css' });
        fs.readFile(__dirname + '/../' + path, function (error, data) {
            if (error) {
                res.writeHead(404);
                res.end();
                throw error;
            } else {
                res.write(data);
                res.end();
            }
        });
    }
    if ((path.indexOf("item") != -1 && !used) || (path.indexOf("i") != -1 && !used)) {
        used = true;
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        fs.readFile(__dirname + '/../html/item.html', function (error, data) {
            if (error) {
                res.writeHead(404);
                res.end();
                throw error;
            } else {
                res.write(data);
                res.end();
            }
        });
    }

    if ((path.indexOf("box") != -1 && !used) || (path.indexOf("b") != -1 && !used)) {
        used = true;
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        fs.readFile(__dirname + '/../html/box.html', function (error, data) {
            if (error) {
                res.writeHead(404);
                res.end();
                throw error;
            } else {
                res.write(data);
                res.end();
            }
        });
    }

    if ((path.indexOf("instruction") != -1 && !used) || (path.indexOf("inst") != -1 && !used)) {
        used = true;
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        fs.readFile(__dirname + '/../html/instruction.html', function (error, data) {
            if (error) {
                res.writeHead(404);
                res.end();
                throw error;
            } else {
                res.write(data);
                res.end();
            }
        });
    }


    if (!used) {
        res.writeHead(204);
        res.write("opps this doesn't exist - 404");
        res.writeHead(404);
        res.end();
    }
}

var server1 = http.createServer(fserverhandler);
var io1 = require('socket.io')(server1); // initiate socket.io server
server1.listen(server_port1, ip);
console.log("Server1 is listening on " + ip + ":" + server_port1);
io1.sockets.setMaxListeners(100);
io1.on('connection', (data) => {
    reload_data();
    iohandle(data);
});

if (file[3] === 'true') {
    var server2 = http.createServer(fserverhandler);
    var io2 = require('socket.io')(server2); // initiate socket.io server
    server2.listen(server_port2, file[4]);
    console.log("Server2 is listening on " + file[4] + ":" + server_port2);
    io2.sockets.setMaxListeners(100);
    io2.on('connection', (data) => {
        reload_data();
        iohandle(data);
    });
}
function openprompt(page, res, req) {
    // fs.readFile(__dirname + '/../html/' + "prompt" + '.html', function (err, data) {
    //     if (err) console.log(err);
    //     res.writeHead(200, { 'Content-Type': 'text/html' });
    //     res.write(data);
    //     res.end();
    // });
    return true;
}

var html;
var instructions;
var box;
var box_box;
var inner_box;
var item;
var size_unit;
var weight_unit;
var unused_item;
var documents = [];
var Users;
var connection;

sql.setdata(pages, size_unitlist, weight_unitlist, file[0]);
sql.initDB(() => { reload_data(); });

function reload_data() {

    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM User LEFT JOIN (Userpages LEFT JOIN HTML_pages ON Userpages.HTML_name=HTML_pages.name) ON User.id = Userpages.User", function (data) {
            Users = data;
        })
    });

    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM box_box", function (data) {
            box_box = data;
        });
    });

    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM item i LEFT JOIN (item_sizes i_s LEFT JOIN (item_sizes_box i_s_b LEFT JOIN box b ON b.id = i_s_b.box_id) ON i_s.id = i_s_b.item_sizes_id) ON i.id = i_s.item_id", function (data) {
            unused_item = data;
        });
    });

    //In box_box not listed as inner box
    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM box b LEFT JOIN box_box b_b ON b.id = b_b.inner_box_id WHERE b_b.inner_box_id IS NULL OR b_b.inner_box_id = '' ORDER BY b.id ASC", function (data) {
            inner_box = data;
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
        sql.read(data, "SELECT * FROM item LEFT JOIN item_sizes ON item.id = item_sizes.item_id ORDER BY name ASC", function (data) {
            item = data;
        });
    });

    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM connection ORDER BY name ASC", function (data) {
            connection = data;
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
    socket.emit('getouter_box', box);
    socket.emit('getinnerbox', inner_box);
    socket.emit('unused_getitem', unused_item);
    socket.emit('getinstructions', instructions);
    socket.emit('getconnection', connection);
    socket.emit('html', html);
    socket.emit('getsettings', file);
    socket.emit('getsize_Unit', size_unit);
    socket.emit('getweight_Unit', weight_unit);
    socket.emit('getdocuments', documents);
    socket.on('login', (data) => {
        //TODO
    });
    socket.on('setboxpic', (data) => { setobjpic(data, socket, false); });
    socket.on('setitempic', (data) => { setobjpic(data, socket, true); });
    socket.on('setinstpdf', (data) => { setobjpdf(data, socket); });
    socket.on('setfile', (data) => { fs.writeFile(__dirname + "/../user_data/_txt/" + data[0], Buffer.from(data[1]), function (err) { if (err) throw err; socket.emit("set_f" + data, true); }); });
    socket.on('getfile', (data) => { let a = fs.readFileSync(__dirname + data).toString(); socket.emit("get_f" + data, a); });
    socket.on('getinstructions', (data) => { sql.recreateDb((db) => { sql.read(db, "SELECT * FROM instructions WHERE id='" + data + "'", (dat) => { socket.emit("get_inst" + data, dat); }); }); });
    socket.on('getItem_data', (data) => { sql.recreateDb((db) => { sql.read(db, "SELECT * FROM item i LEFT JOIN(item_sizes isz LEFT JOIN(item_sizes_box isb LEFT JOIN box b ON b.id=isb.box_id)ON isb.item_sizes_id = isz.id)ON isz.item_id=i.id WHERE i.id='" + data + "' ORDER BY b.id ASC", (dat) => { socket.emit("item" + data, dat); }); }); });
    socket.on('getBox_data', (data) => { sql.recreateDb((db) => { sql.read(db, "SELECT b.weight b_weight, b.id b_id, b.name b_name, b.box_group_id bg_id, b.color b_color, b.picture b_picture, ib.item_id ib_item_id, ib.quantity ib_quantity, i.id i_id, i.name i_name, i.price i_price, i.weight i_weight, i.color i_color, i.picture i_picture FROM Box b LEFT JOIN (item_box ib LEFT JOIN item i ON ib.item_id = i.id) ON b.id = ib.box_id WHERE b.id='" + data + "' ORDER BY b.box_group_id ASC", (dat) => { socket.emit("box" + data, dat); }); }); });
    socket.on("sql_read", (data) => { sql.recreateDb((db) => { sql.read(db, data, (dat) => { socket.emit("sql_r" + data, dat); }); }); });
    socket.on("sql_insert", (data) => { sql.insert(data[0], data[1], () => { reload_data(); socket.emit("sql_i" + data, true); }); });
    socket.on("sql_delete", (data) => { sql.delete(data, () => { reload_data(); socket.emit("sql_d" + data, true); }); });
    socket.on("in_use_box_node", (data) => { in_use_box_node_data = [...in_use_box_node_data, data]; in_use_box_node_data.forEach((values) => { getbox_node_items(values, socket); }); });
    socket.on('box_data', (data) => { addbox(data); socket.emit("successb", true); });
    socket.on('item_data', (data) => { additem(data, socket.emit("successi", address)) });
    socket.on('instruction_data', (data) => { addinstruction(data); socket.emit("successinst", true); });
    socket.on('refresh', (data) => { reload_data(); socket.emit('reloaded', data); });
    socket.on('setsettings', (data) => { socket.emit("setsettings" + data, setsettings(data)); });
    socket.on('user', (data) => { setuser(data); socket.emit("user" + data, data); });
    socket.on('check_user', (data) => { socket.emit("check_user" + data, checkforperm(data)); });
    socket.on('disconnect', function () { });
}

function checkforperm(datas) {
    sql.recreateDb(function (data) {
        sql.read(data, "SELECT * FROM User LEFT JOIN Userpages ON User.id = Userpages.User WHERE User.name = '" + username, function (data) {
            let user = data[0];
            if (user.HTML_name === datas[0]) {
                return true;
            }
        })
    });
    return false;
}

function setuser(data) {
    sql.recreateDb(function (datas) {
        sql.read(datas, "SELECT * FROM User WHERE name = '" + data[0] + "' ODER BY id ASC", function (datas) {
            Array.prototype.forEach.call(datas, (value) => {
                bcrypt.compare(data[1], value, function (err, result) {
                    if (err) throw err;
                    if (result) {
                        username = data[0];
                        password = data[1];
                        temporary = data[2];
                    }
                });
            });
        });
    });
}

function adduser(data) {
    //TODO
}

function setobjpic(data, socket, item) {
    console.log(data);
    let adresse = data[0];
    let picture;
    let picsize = parseInt(data[2]);
    let e = parseInt(data[3]);
    socket.emit("pready" + adresse + "&" + data[1] + "&" + e, 0);
    socket.on("pback" + adresse + "&" + data[1] + "&" + e, (datas) => {
        picture += datas[1];
        if (picture.length + 1 <= picsize) {
            socket.emit("pready" + adresse + "&" + data[1] + "&" + e, (parseInt(datas[0]) + 1));
        } else {
            socket.emit("ptransferred" + adresse + false + "&" + data[1] + "&" + e, false);
        }
    });
    socket.once("ptransferred" + adresse + true + "&" + data[1] + "&" + e, (q) => {
        socket.removeAllListeners("pback" + adresse + "&" + data[1] + "&" + e);
        if (q === true) {
            if (picture.length >= 0) {
                sql.recreateDb(function (datas) {
                    sql.read(datas, "SELECT * FROM item WHERE item.name ='" + data[1] + "' ORDER BY id DESC", (object) => {
                        if (item) {
                            let file = idu.decode(picture);
                            fs.writeFile(__dirname + "/../user_data/_img/" + "item+i=" + object[0].id + "." + file.imageType.slice(file.imageType.indexOf("/") + 1, file.imageType.length), file.dataBuffer, function (err) {
                                if (err) { console.log(err); throw err; }
                                let dat = ["item+i=" + object[0].id + "." + file.imageType.slice(file.imageType.indexOf("/") + 1, file.imageType.length), __dirname + "/../user_data/_img/" + "item+i=" + object[0].id + "." + file.imageType.slice(file.imageType.indexOf("/") + 1, file.imageType.length)];
                                sql.insert("INSERT OR IGNORE INTO picture (name, path) VALUES (?, ?)", dat, (callback) => {
                                    sql.recreateDb((db) => {
                                        sql.read(db, "SELECT * FROM picture WHERE name='" + dat[0] + "' ORDER BY id DESC", (datas) => {
                                            let dat = [object[0].id, datas[0].id];
                                            sql.insert("INSERT OR IGNORE INTO item_picture (item_id, picture_id) VALUES (?, ?)", dat, (callback) => {
                                                reload_data();
                                                socket.emit("pfin" + adresse + "&" + object[0].name, e);
                                            });
                                        });
                                    });
                                });
                            });
                        } else {
                            fs.writeFile(__dirname + "/../user_data/_img/" + "box+b=" + object.id + ".jpg", Buffer.from(picture), function (err) {
                                if (err) { console.log(err); throw err; }
                                let dat = ["box+b=" + object.id + ".jpg", __dirname + "/../user_data/_img/" + "box+b=" + object.id + ".jpg"];
                                sql.insert("INSERT OR IGNORE INTO picture (name, path) VALUES (?, ?)", dat, (callback) => {
                                    sql.recreateDb((db) => {
                                        sql.read(db, "SELECT * FROM picture WHERE name='" + dat[0] + "' ORDER BY id DESC", (datas) => {
                                            let dat = [object.id, datas[0].id];
                                            sql.insert("INSERT OR IGNORE INTO box_picture (box_id, picture_id) VALUES (?, ?)", dat, (callback) => {
                                                reload_data();
                                                socket.emit("pfin" + adresse + "&" + object.name, e);
                                            });
                                        });
                                    });
                                });
                            });
                        }
                    });
                });
            } else {
                console.log("no picture data")
            }
        }
    });
}

function setobjpdf(data, socket) {
    console.log(data);
    let adresse = data[0];
    let pdf;
    let pdfsize = parseInt(data[2]);
    let e = parseInt(data[3]);
    socket.emit("pdready" + adresse + "&" + data[1] + "&" + e, 0);
    socket.on("pdback" + adresse + "&" + data[1] + "&" + e, (datas) => {
        pdf += datas[1];
        if (pdf.length + 1 <= pdfsize) {
            socket.emit("pdready" + adresse + "&" + data[1] + "&" + e, (parseInt(datas[0]) + 1));
        } else {
            socket.emit("pdtransferred" + adresse + false + "&" + data[1] + "&" + e, false);
        }
    });
    socket.once("pdtransferred" + adresse + true + "&" + data[1] + "&" + e, (q) => {
        socket.removeAllListeners("pdback" + adresse + "&" + data[1] + "&" + e);
        if (q === true) {
            if (pdf.length >= 0) {
                sql.recreateDb(function (datas) {
                    sql.read(datas, "SELECT * FROM instructions WHERE instructions.name ='" + data[1] + "' ORDER BY id DESC", (object) => {
                        fs.writeFile(__dirname + "/../user_data/_pdf/" + "instruction+inst=" + object[0].id + ".pdf", pdf, 'base64', function (err) {
                            if (err) { console.log(err); throw err; }
                            let dat = [data[1], __dirname + "/../user_data/_img/" + "item+i=" + object[0].id + ".pdf"];
                            sql.insert("UPDATE instructions SET instructions.pdfdocument_path = ? WHERE instructions.name = ?", dat, (callback) => {
                                reload_data();
                                socket.emit("pfin" + adresse + "&" + object[0].name, e);
                            });
                        });
                    });
                });
            } else {
                console.log("no picture data")
            }
        }
    });
}

function getitem(data, d, socket, item) {
    console.log(data);
    sql.recreateDb(function (datas) {
        sql.read(datas, "SELECT * FROM item WHERE item.name ='" + data + "' ORDER BY id DESC", (dat) => {
            console.log(1);
            console.log(dat);
            console.log(dat[0]);
            setobjpic(d, socket, item, dat[0]);
        });
    });
}
function getbox(data) {
    sql.recreateDb(function (datas) {
        sql.read(datas, "SELECT * FROM box i WHERE i.name ='" + data + "' ORDER BY id DESC", (dat) => {
            return dat[0];
        });
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
    let d = [data[0], data[4], data[5], data[6]];
    console.log(1);
    sql.insert("INSERT OR IGNORE INTO box (name, color, weight, location) VALUES (?, ?, ?, ?)", d, (callback) => {
        sql.recreateDb((db) => {
            sql.read(db, "SELECT * FROM box WHERE name = '" + data[0] + "' ORDER BY id DESC", (values) => {
                var b = false;
                if (!b) {
                    for (let i = 0; i < data[3].length; i += 2) {
                        let dat = [data[3][i], parseInt(values[0].id), data[3][i + 1]];
                        if (dat[2] != 0) {
                            sql.recreateDb((db) => {
                                sql.read(db, "SELECT * FROM item_box WHERE item_id='" + data[3][i] + "' AND box_id='1' ORDER BY id DESC", (datas) => {
                                    console.log(2);
                                    sql.insert("INSERT OR IGNORE INTO item_box (item_id, box_id, quantity) VALUES (?, ?, ?)", dat, (callback) => {
                                        let da = [];
                                        sql.insert("UPDATE item_box SET quantity='" + (datas[0].quantity - data[3][i + 1]) + "' WHERE item_id='" + data[3][i] + "' AND box_id='1'", da, (w) => {
                                            reload_data();
                                        });
                                    });
                                });
                            });
                        }
                    }
                    for (let i = 0; i < data[2].length; i += 1) {
                        let dat = [data[2][i], parseInt(values[0].id)];
                        console.log(3);
                        sql.insert("INSERT OR IGNORE INTO box_box (inner_box_id, outer_box_id) VALUES (?, ?)", dat, (callback) => {
                            reload_data();
                        });
                    }
                    let dat = [data[1], parseInt(values[0].id)];
                    console.log(4);
                    sql.insert("INSERT OR IGNORE INTO box_box (inner_box_id, outer_box_id) VALUES (?, ?)", dat, (callback) => {
                        reload_data();
                    });
                    b = true;
                }
                // if (data[5] != 0) {
                //     fs.writeFile(__dirname + "/../user_data/_img/" + "box+b=" + values[0].id + ".jpg", Buffer.from(data[4]), function (err) {
                //         if (err) throw err;
                //         let dat = ["box+b=" + values[0].id + ".jpg", __dirname + "/../user_data/_img/" + "box+b=" + values[0].id + ".jpg"];
                //         sql.insert("INSERT OR IGNORE INTO picture (name, path) VALUES (?, ?)", dat, (callback) => {
                //             sql.recreateDb((db) => {
                //                 sql.read(db, "SELECT * FROM picture WHERE name='" + dat[0] + "' ORDER BY id DESC", (datas) => {
                //                     let dat = [parseInt(values[0].id), datas[0].id];
                //                     sql.insert("INSERT OR IGNORE INTO box_picture (box_id, picture_id) VALUES (?, ?)", dat, (callback) => {
                //                         reload_data();
                //                     });
                //                 });
                //             });
                //         });
                //     });
                // }
            });
        });
    });
}

function addinstruction(data) {
    let d = [data[0]];
    sql.insert("INSERT OR IGNORE INTO instructions (name) VALUES (?)", d, (callback) => {
        sql.recreateDb((db) => {
            sql.read(db, "SELECT * FROM instructions WHERE name = '" + data[0] + "' ORDER BY id DESC", (values) => {
                var b = false;
                if (!b) {
                    for (let i = 0; i < data[2].length; i++) {
                        let dat = [];
                        sql.insert("UPDATE item SET instructions_id ='" + values[0].id + "' WHERE id = '" + parseInt(data[1][i]) + "'", dat, (callback) => {
                            reload_data();
                        });
                    }
                    b = true;
                }
                if (data[3] != 0) {
                    fs.writeFile(__dirname + "/../user_data/_txt/" + values[0].id + ".txt", Buffer.from(data[2]), function (err) {
                        if (err) throw err;
                        let da = [];
                        sql.insert("UPDATE instructions SET document ='" + values[0].id + ".txt" + "' WHERE id = '" + values[0].id + "'", da, (w) => { });
                    });
                }
            });
        });
    });
}

function additem(data, overcallback) {
    let dat = [data[0], data[1], data[2]];
    console.log(data);
    sql.insert("INSERT OR IGNORE INTO item (name, instructions_id, color) VALUES (?, ?, ?)", dat, (q) => {
        reload_data();
        sql.recreateDb((db) => {
            sql.read(db, "SELECT * FROM item WHERE name ='" + data[0] + "' ORDER BY id DESC", (values) => {
                for (let i = 0; i < parseInt(data[3]); i++) {
                    let dat = [values[0].id, data[4][i], data[5][i], data[6][i], data[7][i], data[10][i], data[9][i], data[11][i]];
                    sql.insert("INSERT OR IGNORE INTO item_sizes (item_id, sizeX, sizeY, sizeZ, quantity, price, weight, IP) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", dat, (callback) => {
                        sql.recreateDb((db) => {
                            sql.read(db, "SELECT * FROM item_sizes WHERE item_id ='" + values[0].id + "' AND sizex='" + data[4][i] + "' ORDER BY id DESC", (d) => {
                                for (let e = 0; e < data[8][i].length; e++) {
                                    sql.recreateDb((db) => {
                                        let box_id = parseInt(data[8][i][e][0])
                                        sql.read(db, "SELECT * FROM box WHERE id ='" + box_id + "' ORDER BY id DESC", (da) => {
                                            if (da.length == 1) {
                                                let dat = [d.id, box_id, data[8][i][e][1]];
                                                sql.insert("INSERT OR IGNORE INTO item_sizes_box (item_sizes_id, box_id, quantity) VALUES (?, ?, ?)", dat, (callback) => {
                                                    reload_data();
                                                });
                                            } else {
                                                console.log("No Box with id:" + box_id + " available");
                                            }
                                        });
                                    });
                                }
                                for (let e = 0; e < data[12][i].length; e++) {
                                    sql.recreateDb((db) => {
                                        let con_id = parseInt(data[12][i][e][0])
                                        sql.read(db, "SELECT * FROM connection WHERE id ='" + con_id + "' ORDER BY id DESC", (da) => {
                                            if (da.length == 1) {
                                                let dat = [con_id, d.id, , data[12][i][e][1]];
                                                sql.insert("INSERT OR IGNORE INTO item_sizes_box (connection_id, item_sizes_id, count) VALUES (?, ?, ?)", dat, (callback) => {
                                                    reload_data();
                                                });
                                            } else {
                                                console.log("No Connection with id:" + con_id + " available");
                                            }
                                        });
                                    });
                                }
                            });
                        });
                    });
                }
                overcallback;
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
    return [ip, server_port1];
}
