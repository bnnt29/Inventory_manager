"use strict";
const sqlite3 = require('sqlite3').verbose();
const file = "C:/Users/Berni/Documents/inventory_manager/database/inventory.db";
var db;

function createDb() {
    console.log("createDb inventory");
    db = new sqlite3.Database(file, createTables);
}

function createTables() {
    console.log("Create Tables");
    //console.log("createTable box");
    db.run("CREATE TABLE IF NOT EXISTS box (box_id INTEGER NOT NULL PRIMARY KEY UNIQUE, name STRING (200) NOT NULL, box_group_id INTEGER (100) REFERENCES box_group (box_group_id)  NOT NULL);");
    //console.log("createTable box_group");
    db.run("CREATE TABLE IF NOT EXISTS box_group (box_group_id INTEGER NOT NULL PRIMARY KEY, name STRING (100) NOT NULL);");
    //console.log("createTable HTML_pages");
    db.run("CREATE TABLE IF NOT EXISTS HTML_pages (HTML_id INTEGER PRIMARY KEY UNIQUE NOT NULL, name STRING (100) NOT NULL, path STRING (200) NOT NULL);");
    //console.log("createTable in_use");
    db.run("CREATE TABLE IF NOT EXISTS in_use (item_id INTEGER PRIMARY KEY REFERENCES item (item_id) NOT NULL, box_id   INTEGER (100) NOT NULL REFERENCES box (box_id), quantity INTEGER (100) NOT NULL);");
    //console.log("createTable instructions");
    db.run("CREATE TABLE IF NOT EXISTS instructions (instructions_id INTEGER NOT NULL PRIMARY KEY, name STRING (100) NOT NULL, document STRING (200));");
    //console.log("createTable item");
    db.run("CREATE TABLE IF NOT EXISTS item (item_id INTEGER NOT NULL PRIMARY KEY UNIQUE, name STRING (100)  NOT NULL, instructions_id INTEGER (100) NOT NULL REFERENCES instructions (instructions_id),size INTEGER (100) NOT NULL);");
    //console.log("createTable item_box");
    db.run("CREATE TABLE IF NOT EXISTS item_box (item_id INTEGER PRIMARY KEY NOT NULL REFERENCES item (item_id),box_id INTEGER (100) REFERENCES box (box_id) NOT NULL,quantity INTEGER (100) NOT NULL);");
    readAllRows();
}
function insertRows() {
    console.log("insertRows item i");
    var stmt = db.prepare("INSERT INTO item VALUES (?)");

    for (var i = 0; i < 10; i++) {
        stmt.run("item " + i);
    }

    stmt.finalize(readAllRows);
}

function readAllRows() {
    console.log("readAllRows item");
    db.all("SELECT item_id AS id, name, size  FROM item", function (err, rows) {
        rows.forEach(function (row) {
            console.log(row.id + ": " + row.name + ", " + row.size);
        });
        closeDb();
    });
}

function closeDb() {
    console.log("closeDb");
    db.close();
}

function runExample() {
    createDb();
}

runExample();

var http = require('http');
var _ = require('underscore'); var ip = _.chain(require('os').networkInterfaces()).values().flatten().filter(function (val) { return (val.family == 'IPv4' && val.internal == false) }).pluck('address').first().value();
var server_port = process.env.PORT || 4466;
var url = require('url');
var fs = require('fs');
var server = http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    if (path == '' || path == '/') {
        path = '/index.html';
    }
    switch (path) {
        case '/':
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.write("This is Test Message!");
            res.end();
            break;
        case '/index.html':
            fs.readFile(__dirname + path, function (error, data) {
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
            break;
        case '/sql_site.html':
            fs.readFile(__dirname + path, function (error, data) {
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
            break;
        default:
            res.writeHead(404);
            res.write("opps this doesn't exist - 404");
            res.end();
            break;
    }
});
server.listen(server_port, ip);
console.log("Server is listening on " + ip + ":" + server_port);