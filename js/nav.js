"use strict";
function nav_items() {
    var nav_set = false;
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.once('connect', () => {
        socket.once('html', (data) => {
            if (data != null) {
                if (!nav_set) {
                    data.forEach(function (row) {
                        var body = document.createElement("li");
                        body.classList.add('nav-item');
                        let element = document.createElement("a");
                        element.classList.add('nav-link');
                        element.href = row.path;
                        element.id = row.name;
                        element.innerText = row.name;
                        body.appendChild(element);
                        let append = document.getElementById("nav_ul");
                        append.appendChild(body);
                    })
                    nav_set = true;
                }
            } else {
                var ip = location.host;
                var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
                socket.once('connect', () => {
                    socket.once('html', (data) => { if (data != null) { console.log(data); nav_items(); } else { console.log("reload not successfull"); location.reload; } });
                });
            }
        });
    });
}