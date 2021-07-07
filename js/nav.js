"use strict";
function nav_links() {
    var htdb = require('./sql')().recreateDb();
    var body = document.createElement("li");
    body.classList.add('nav-item');
    console.log("1");
    var stmt = htdb.all("SELECT * FROM HTML_pages", function (err, rows) {
        rows.forEach(function (row) {
            document.write(row.id + ": " + row.name + ", " + row.path);
            let element = document.createElement("a");
            element.classList.add('nav-link');
            element.href = "row.path";
            element.id = "row.name";
            element.innerText = "row.name";
            body.appendChild(element);
            let append = document.getElementById("nav_ul");
            append.appendChild(body);
        });
        if (err != null) {
            document.write(err);
        }
        closeDb(true, htdb);
    });
}
module.exports = {
    nav_links: nav_links()
}