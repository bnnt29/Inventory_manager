"use strict";

const { values } = require('underscore');

const sqlite3 = require('sqlite3').verbose();
var file = "";
var db;
var pages;
var size_unit;
var weight_unit;


function createDb() {
    db = new sqlite3.Database(file, err => {
        if (err) {
            console.log(err);
            return;
        }
        createTables();
    });
    console.log("database connected at: " + file);
}

function recreateDb(callback) {
    callback(new sqlite3.Database(file));
}

function createTables() {
    //console.log("createTable box");
    db.run("CREATE TABLE IF NOT EXISTS version (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, version STRING (200) NOT NULL);");
    db.run("CREATE TABLE IF NOT EXISTS box (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (200) NOT NULL UNIQUE, color STRING (200), weight INTEGER (100), location STRING (200), instructions_id INTEGER (100) REFERENCES instructions (id));");
    db.run("CREATE TABLE IF NOT EXISTS box_box (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, inner_box_id INTEGER (100) NOT NULL REFERENCES box (id), outer_box_id INTEGER (100) NOT NULL REFERENCES box (id));");
    db.run("CREATE TABLE IF NOT EXISTS in_use (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, item_sizes_id INTEGER  NOT NULL REFERENCES item_sizes (id), box_id INTEGER (100) NOT NULL REFERENCES box (id), location STRING (100), quantity INTEGER (100) NOT NULL, note STRING (200));");
    db.run("CREATE TABLE IF NOT EXISTS instructions (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (100) NOT NULL UNIQUE, txtdocument STRING (200), pdfdocument_path STRING (200));");
    db.run("CREATE TABLE IF NOT EXISTS item (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (100) NOT NULL UNIQUE, instructions_id INTEGER (100) REFERENCES instructions (id), color STRING (200));");
    db.run("CREATE TABLE IF NOT EXISTS item_sizes (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, item_id INTEGER NOT NULL REFERENCES item (id), sizeX INTEGER (100), sizeY INTEGER (100), sizeZ INTEGER (100), quantity INTEGER (100) NOT NULL, price INTEGER (100), weight INTEGER (100), IP STRING (40), note STRING (200));");
    db.run("CREATE TABLE IF NOT EXISTS item_sizes_box (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, item_sizes_id INTEGER NOT NULL REFERENCES item_sizes (id), box_id INTEGER (100) REFERENCES box (id) NOT NULL, quantity INTEGER (100) NOT NULL);");
    db.run("CREATE TABLE IF NOT EXISTS item_picture (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, item_id INTEGER NOT NULL REFERENCES item (id), picture_id INTEGER (100) REFERENCES picture (id) NOT NULL);");
    db.run("CREATE TABLE IF NOT EXISTS box_picture (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, box_id INTEGER NOT NULL REFERENCES box (id), picture_id INTEGER (100) REFERENCES picture (id) NOT NULL);");
    db.run("CREATE TABLE IF NOT EXISTS picture (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING(200) NOT NULL, path STRING (200) NOT NULL);");
    db.run("CREATE TABLE IF NOT EXISTS event (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING(200) NOT NULL, description STRING (100));");
    db.run("CREATE TABLE IF NOT EXISTS event_item (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, event_id INTEGER NOT NULL REFERENCES event (id),item_sizes_id INTEGER NOT NULL REFERENCES item_sizes (id), quantity INTEGER (100) NOT NULL);");
    db.run("CREATE TABLE IF NOT EXISTS HTML_pages (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (100) NOT NULL UNIQUE, path STRING (200) NOT NULL UNIQUE, position INTEGER (100)  NOT NULL);");
    db.run("CREATE TABLE IF NOT EXISTS Userpages (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, HTML_name STRING NOT NULL REFERENCES HTML_pages (name), User INTEGER NOT NULL REFERENCES User (id));");
    db.run("CREATE TABLE IF NOT EXISTS User (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (100) NOT NULL UNIQUE, password STRING (100), level INTEGER (100), canchangeIV INTEGER (100));");
    db.run("CREATE TABLE IF NOT EXISTS connection_category (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (100) NOT NULL UNIQUE);");
    db.run("CREATE TABLE IF NOT EXISTS connection (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (100) NOT NULL UNIQUE, gender Integer NOT NULL, note STRING (200), instructions_id INTEGER (100) REFERENCES instructions (id));");
    db.run("CREATE TABLE IF NOT EXISTS connection_copatible (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, connection_id INTEGER NOT NULL REFERENCES connection (id), compatible_id INTEGER NOT NULL REFERENCES connection (id));");
    db.run("CREATE TABLE IF NOT EXISTS connection_item_sizes (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, connection_id INTEGER NOT NULL REFERENCES connection (id), item_sizes_id INTEGER NOT NULL REFERENCES item_sizes (id), count INTEGER (100) NOT NULL);", closeDb(false, db));
}
function insertunit() {
    insertdefaults();
}

function insertdefaults() {
    insert("INSERT OR IGNORE INTO box (name, color) VALUES (?, ?)", ["default", "#FFFFFF"], (values) => {
        insert("INSERT OR IGNORE INTO User (name, password, level, canchangeIV) VALUES (?, ?, ?, ?)", ["admin", "", "0", "1"], (values) => {
            insert("INSERT OR IGNORE INTO User (name, password, level, canchangeIV) VALUES (?, ?, ?, ?)", ["standard", "", "1", "0"], (values) => {
                insert("INSERT OR IGNORE INTO Userpages (HTML_name, User) VALUES (?, ?)", ["settings", 2], (values) => {
                    insert("INSERT OR IGNORE INTO version (version) VALUES (?)", ["IM 1.0.0"], (values) => {
                        return;
                    });
                });
            });
        });
    });
}

function insert(r, data, callback) {
    recreateDb(function (db) {
        var stmt = db.prepare(r);
        stmt.run(...data);
        stmt.finalize(() => { closedb(db, callback(true)); });
    });
}

function deletesql(r, callback) {
    recreateDb(function (db) {
        var stmt = db.prepare(r);
        stmt.run();
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

function closedb(dbn, callback) {
    dbn.close();
    callback;
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

function setdata(p, a, b, f) {
    pages = p;
    size_unit = a;
    weight_unit = b;
    file = f + "/inventory.db";
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
    module.setdata = function (p, a, db, callback) { setdata(p, a, db, callback) };
    module.initDB = function (callback) { initDB(callback) };
    module.recreateDb = function (callback) { recreateDb(callback) };
    module.closedb = function (db) { closedb(db) };
    module.insert = function (p, a, db) { insert(p, a, db) };
    module.delete = function (p, a) { deletesql(p, a); }
    return module;
};