"use strict";
const sqlite3 = require('sqlite3').verbose();
const file = "C:/Users/Berni/Documents/inventory_manager/database/inventory.db";
var db;
var pages;
var i = 0;


function createDb(b) {
    console.log("createDb inventory");
    if (b) {
        db = new sqlite3.Database(file, createTables);
    } else {
        db = new sqlite3.Database(file, insertPages);
    }
}

function recreateDb(callback) {
    console.log("recreateDb inventory");
    callback(new sqlite3.Database(file));
}

function createTables() {
    console.log("Create Tables");
    //console.log("createTable box");
    db.run("CREATE TABLE IF NOT EXISTS box (box_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (200) NOT NULL, box_group_id INTEGER (100) REFERENCES box_group (box_group_id)  NOT NULL);");
    //console.log("createTable box_group");
    db.run("CREATE TABLE IF NOT EXISTS box_group (box_group_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (100) NOT NULL);");
    //console.log("createTable in_use");
    db.run("CREATE TABLE IF NOT EXISTS in_use (item_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE REFERENCES item (item_id), box_id   INTEGER (100) NOT NULL REFERENCES box (box_id), quantity INTEGER (100) NOT NULL);");
    //console.log("createTable instructions");
    db.run("CREATE TABLE IF NOT EXISTS instructions (instructions_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (100) NOT NULL, document STRING (200));");
    //console.log("createTable item");
    db.run("CREATE TABLE IF NOT EXISTS item (item_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (100)  NOT NULL, instructions_id INTEGER (100) NOT NULL REFERENCES instructions (instructions_id),size INTEGER (100) NOT NULL);");
    //console.log("createTable item_box");
    db.run("CREATE TABLE IF NOT EXISTS item_box (item_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE REFERENCES item (item_id),box_id INTEGER (100) REFERENCES box (box_id) NOT NULL,quantity INTEGER (100) NOT NULL);");
    //console.log("createTable HTML_pages");
    db.run("CREATE TABLE IF NOT EXISTS HTML_pages (HTML_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name STRING (100) NOT NULL, path STRING (200) NOT NULL UNIQUE);", readAllRows);
}

function insertPages() {
    console.log("Add Pages");
    var stmt = db.prepare("INSERT OR IGNORE INTO HTML_pages (name, path) VALUES (?, ?)");

    for (var i = 0; i < pages.length; i++) {
        stmt.run(pages[i], pages[i] + '.html');
    }
    stmt.finalize(closeDb(true, db));
}

function readAllRows() {
    console.log("readAllRows HTML_pages");
    var stmt = db.all("SELECT * FROM HTML_pages", function (err, rows) {
        rows.forEach(function (row) {
            console.log(row.id + ": " + row.name + ", " + row.path);
        });
        closeDb(false, db);
    });
}

function closeDb(b, db) {
    console.log("closeDb");
    if (b) {
        db.close();
    } else {
        db.close(initDB(false));
    }
}

function initDB(b) {
    createDb(b);
}

function closedb(db) {
    db.close(function () { return true; });
}

function setpages(p) {
    pages = p;
}

function read(db, r, callback) {
    var stmt = db.all(r, function (err, rows) {
        callback(rows);
        closeDb(false, db);
    });
}

module.exports = function (p, a, db, callback) {
    var module = {};
    module.read = function (db, r, callback) { read(db, r, callback) }
    module.setpages = function (p) { setpages(p) };
    module.initDB = function (a) { initDB(a) };
    module.recreateDb = function (callback) { recreateDb(callback) };
    module.closedb = function (db) { closedb(db) };
    return module;
};