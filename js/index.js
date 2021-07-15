"use strict";
function stats() {
    var table_set = false;
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.on('connect', () => {
        socket.on('stats', (data) => {
            if (!table_set) {
                data.forEach(function (value) {
                    let parent = document.getElementById("stats_table");
                    let row = document.createElement("tr");
                    let col_id = document.createElement("td");
                    let col_name = document.createElement("td");
                    let id = document.createElement("p");
                    let name = document.createElement("p");
                    parent.appendChild(row);
                    row.appendChild(col_id);
                    row.appendChild(col_name);
                    col_id.appendChild(id);
                    col_name.appendChild(name);
                    id.innerHTML = value.id;
                    name.innerHTML = value.name;
                });
                table_set = true;
            }
        })
    });
}