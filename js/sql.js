"use strict";

const { values } = require('underscore');

const sqlite3 = require('sqlite3').verbose();
const file = "C:/Users/Berni/Documents/inventory_manager/database/inventory.db";
var db;
var pages;
var unit;
var i = 0;


function createDb() {
    db = new sqlite3.Database(file, createTables);
}

function recreateDb(callback) {
    callback(new sqlite3.Database(file));
}

function createTables() {
    //console.log("createTable box");
    db.run("CREATE TABLE IF NOT EXISTS box (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (200) NOT NULL UNIQUE, box_group_id INTEGER (100) REFERENCES box_group (id), color STRING (200), picture STRING (200));");
    db.run("CREATE TABLE IF NOT EXISTS box_group (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (100) NOT NULL UNIQUE, location STRING (100), color STRING (200), picture STRING (200));");
    db.run("CREATE TABLE IF NOT EXISTS in_use (item_id INTEGER  NOT NULL REFERENCES item (id), box_id   INTEGER (100) NOT NULL REFERENCES box (id), quantity INTEGER (100) NOT NULL, notes STRING (100));");
    db.run("CREATE TABLE IF NOT EXISTS instructions (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (100) NOT NULL UNIQUE, document STRING (200));");
    db.run("CREATE TABLE IF NOT EXISTS item (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (100) NOT NULL UNIQUE, instructions_id INTEGER (100) REFERENCES instructions (id), size INTEGER (100), total_quantity INTEGER (100) NOT NULL, color STRING (200), picture STRING (200));");
    db.run("CREATE TABLE IF NOT EXISTS item_box (item_id INTEGER NOT NULL REFERENCES item (id), box_id INTEGER (100) REFERENCES box (id) NOT NULL, quantity INTEGER (100) NOT NULL);");
    db.run("CREATE TABLE IF NOT EXISTS event (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, item_id INTEGER NOT NULL REFERENCES item (id), quantity INTEGER (100) NOT NULL);");
    db.run("CREATE TABLE IF NOT EXISTS HTML_pages (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (100) NOT NULL UNIQUE, path STRING (200) NOT NULL UNIQUE, position INTEGER (100)  NOT NULL);");
    db.run("CREATE TABLE IF NOT EXISTS unit (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (100) NOT NULL UNIQUE, multiplicator INTEGER (100) NOT NULL);", closeDb(false, db));
}
function insertunit() {
    for (var i = 0; i < unit.length; i += 2) {
        recreateDb(function (db) {
            var stmt = db.prepare("INSERT OR IGNORE INTO unit (name, multiplicator) VALUES (?, ?)");
            stmt.run(unit[i], unit[i + 1]);
            stmt.finalize(() => {
                closedb(db);
            });
        });
    }
    insertdefaults();
}

function insertdefaults() {
    insert("INSERT OR IGNORE INTO box_group (id, name, location, color) VALUES (?, ?, ?, ?)", [1, "default", "somewhere", "#FFFFFF"], (values) => {
        insert("INSERT OR IGNORE INTO box (id, name, box_group_id, color) VALUES (?, ?, ?, ?)", [1, "default", 1, "#FFFFFF"], (values) => {
            return;
        });
    });
}

function insert(r, data, callback) {
    recreateDb(function (db) {
        var stmt = db.prepare(r);
        stmt.run(...data);
        stmt.finalize(() => { closedb(db); callback(true); });
    });
}

function readAllRows(bool) {
    var stmt = db.all("SELECT * FROM HTML_pages", function (err, rows) {
        if (bool) {
            rows.forEach(function (row) {
                console.log(row.HTML_id + ": " + row.name + ", " + row.path);
            });
        }
        closedb(false, db);
    });
}

function initDB(callback) {
    createDb();
    callback;
}

function closedb(dbn) {
    dbn.close();
}

function closeDb(b, dbn) {
    if (b) {
        dbn.close();
    } else {
        dbn.close(() => { let i = 0; pages.forEach((values) => { insert("INSERT OR IGNORE INTO HTML_pages (name, path, position) VALUES (?, ?, ?)", [values, values + '.html', i], () => { }); i += 1; }); insertunit(); });
    }
}

function closedbcall(dbn, callback) {
    dbn.close(callback);
}

function setdata(p, a) {
    pages = p;
    unit = a;
}

function read(dbn, r, callback) {
    var stmt = dbn.all(r, function (err, rows) {
        closedb(dbn);
        callback(rows);
    });
}

module.exports = function (p, a, db, callback, r) {
    var module = {};
    module.read = function (db, r, callback) { read(db, r, callback) }
    module.setdata = function (p, a) { setdata(p, a) };
    module.initDB = function (callback) { initDB(callback) };
    module.recreateDb = function (callback) { recreateDb(callback) };
    module.closedb = function (db) { closedb(db) };
    module.insert = function (p, a, callback) { insert(p, a, callback) };
    return module;
};