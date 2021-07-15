"use strict";
const sqlite3 = require('sqlite3').verbose();
const file = "C:/Users/Berni/Documents/inventory_manager/database/inventory.db";
var db;
var pages;
var unit;
var i = 0;


function createDb(b) {
    if (b) {
        db = new sqlite3.Database(file, createTables);
    } else {
        db = new sqlite3.Database(file, insertPages);
    }
}

function recreateDb(callback) {
    callback(new sqlite3.Database(file));
}

function createTables() {
    //console.log("createTable box");
    db.run("CREATE TABLE IF NOT EXISTS box (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (200) NOT NULL UNIQUE, box_group_id INTEGER (100) REFERENCES box_group (id));");
    db.run("CREATE TABLE IF NOT EXISTS box_group (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (100) NOT NULL UNIQUE, location STRING (100));");
    db.run("CREATE TABLE IF NOT EXISTS in_use (item_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE REFERENCES item (id), box_id   INTEGER (100) NOT NULL REFERENCES box (id), quantity INTEGER (100) NOT NULL, notes STRING (100));");
    db.run("CREATE TABLE IF NOT EXISTS instructions (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (100) NOT NULL, document STRING (200));");
    db.run("CREATE TABLE IF NOT EXISTS item (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (100) NOT NULL UNIQUE, instructions_id INTEGER (100) REFERENCES instructions (id), size INTEGER (100));");
    db.run("CREATE TABLE IF NOT EXISTS item_box (item_id INTEGER PRIMARY KEY NOT NULL REFERENCES item (id), box_id INTEGER (100) REFERENCES box (id) NOT NULL,quantity INTEGER (100) NOT NULL);");
    db.run("CREATE TABLE IF NOT EXISTS HTML_pages (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (100) NOT NULL UNIQUE, path STRING (200) NOT NULL UNIQUE);", readAllRows(false));
    db.run("CREATE TABLE IF NOT EXISTS event (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, item_id INTEGER KEY  NOT NULL UNIQUE REFERENCES item (id), quantity INTEGER (100) NOT NULL);");
    db.run("CREATE TABLE IF NOT EXISTS unit (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (100) NOT NULL UNIQUE, multiplicator INTEGER (100) NOT NULL);");
}

function insertPages() {
    var stmt = db.prepare("INSERT OR IGNORE INTO HTML_pages (name, path) VALUES (?, ?)");
    for (var i = 0; i < pages.length; i++) {
        stmt.run(pages[i], pages[i] + '.html');
    }
    stmt.finalize(() => {
        var stmt = db.prepare("INSERT OR IGNORE INTO unit (name, multiplicator) VALUES (?, ?)");
        for (var i = 0; i < unit.length; i += 2) {
            stmt.run(unit[i], unit[i + 1]);
        }
        stmt.finalize(closeDb(true, db));
    });
}

function insert(r, data, callback) {
    console.log("6");
    console.log(...data);
    recreateDb(function (db) {
        try {
            var stmt = db.prepare(r);
            stmt.run(...data);
            callback;
            stmt.finalize(closeDb(false, db));
        } catch (e) {
            console.log(e);
        }
    });
}

function readAllRows(bool) {
    var stmt = db.all("SELECT * FROM HTML_pages", function (err, rows) {
        if (bool) {
            rows.forEach(function (row) {
                console.log(row.id + ": " + row.name + ", " + row.path);
            });
        }
        closeDb(false, db);
    });
}

function closeDb(b, dbn) {
    if (b) {
        dbn.close();
    } else {
        dbn.close(createDb(false));
    }
}

function initDB(b) {
    createDb(b);
}

function closedb(dbn) {
    dbn.close();
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
    module.initDB = function (a) { initDB(a) };
    module.recreateDb = function (callback) { recreateDb(callback) };
    module.closedb = function (db) { closedb(db) };
    module.insert = function (p, a, callback) { insert(p, a, callback) };
    return module;
};