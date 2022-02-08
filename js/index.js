var sort_table = 0;
var arrowup = "&#9650";
var arrowdown = "&#9660";
function onChange(a) {
    document.getElementById("itembody").innerHTML = null;
    switch (a) {
        case "Item":
            item_overview();
            break;
        case "Box":
            box_overview();
            break;
        case "Instruction":
            break;
        case "Connections":
            break;
        case "User":
            break;
    }
}

function chngsort(a, b) {
    Array.prototype.forEach.call(document.getElementsByTagName("th"), (value) => {
        if (value.innerHTML.indexOf("&") != -1) {
            value.innerHTML = value.innerHTML.substring(0, value.innerHTML.indexOf("&") - 1);
        }
    });
    if (sort_table == b) {
        sort_table = a;
    } else {
        sort_table = b;
    }
    onChange();
}

function item_overview() {
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    let sql = "SELECT item.id, item.name, item.instructions_id, COUNT(item_sizes.id) c, SUM(item_sizes.quantity) s FROM item LEFT JOIN item_sizes ON item.id = item_sizes.item_id";
    switch (sort_table) {
        case 0:
            sql += "ORDER BY item.id ASC";
            break;
        case 1:
            sql += "ORDER BY item.id DESC";
            break;
        case 2:
            sql += "ORDER BY item.name ASC";
            break;
        case 3:
            sql += "ORDER BY item.name DESC";
            break;
        case 4:
            sql += "ORDER BY item.instructions_id ASC";
            break;
        case 5:
            sql += "ORDER BY item.instructions_id DESC";
            break;
        case 6:
            sql += "ORDER BY c ASC";
            break;
        case 7:
            sql += "ORDER BY c DESC";
            break;
        case 8:
            sql += "ORDER BY s ASC";
            break;
        case 9:
            sql += "ORDER BY s DESC";
            break;
    }
    socket.once('connect', () => {
        socket.emit("sql_read", sql);
        socket.once("sql_r" + sql, (data) => {
            console.log(data);
            if (data == null || data == "") {
                let container = document.getElementById("container");
                let error = document.createElement("p");
                error.innerHTML = "Nothing for that object found";
                container.appendChild(error);
            } else {
                let container = document.getElementById("itembody");
                data.forEach((d) => {
                    let tr = document.createElement("tr");
                    container.appendChild(tr);
                    let td = document.createElement("td");
                    let a = document.createElement("a");
                    a.innerHTML = d.id;
                    a.href = location.host + "/item?id=" + d.id;
                    td.appendChild(a);
                    tr.appendChild(td);
                    td = document.createElement("td");
                    a = document.createElement("a");
                    a.innerHTML = d.name;
                    a.href = location.host + "/item?id=" + d.id;
                    td.appendChild(a);
                    tr.appendChild(td);
                    td = document.createElement("td");
                    a = document.createElement("a");
                    a.innerHTML = d.instruction_id;
                    a.href = location.host + "/instruction?id=" + d.instruction_id;
                    td.appendChild(a);
                    tr.appendChild(td);
                    td = document.createElement("td");
                    a = document.createElement("p");
                    a.innerHTML = d.c;
                    td.appendChild(a);
                    tr.appendChild(td);
                    td = document.createElement("td");
                    a = document.createElement("p");
                    a.innerHTML = d.s;
                    td.appendChild(a);
                    tr.appendChild(td);
                });
            }
        });
    });
}

function box_overview() {
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    let sql = "SELECT * FROM box ";
    switch (sort_table) {
        case 0:
            sql += "ORDER BY box.id ASC";
            break;
        case 1:
            sql += "ORDER BY box.id DESC";
            break;
        case 2:
            sql += "ORDER BY box.name ASC";
            break;
        case 3:
            sql += "ORDER BY box.name DESC";
            break;
        case 4:
            sql += "ORDER BY box.box_group_id ASC";
            break;
        case 5:
            sql += "ORDER BY box.box_group_id DESC";
            break;
        case 6:
            sql += "ORDER BY item.weight ASC";
            break;
        case 7:
            sql += "ORDER BY item.weight DESC";
            break;
    }
    socket.once('connect', () => {
        socket.emit("sql_read", sql);
        socket.once("sql_r" + sql, (data) => {
            if (data == null || data == "") {
                let container = document.getElementById("table-container");
                let error = document.createElement("p");
                error.innerHTML = "Nothing for that object found";
                container.appendChild(error);
            } else {
                let container = document.getElementById("table-container");
                let table = document.createElement("table");
                table.style.width = "100%";
                container.appendChild(table);
                let trh = document.createElement("tr");
                table.appendChild(trh);
                let id = document.createElement("th");
                id.innerHTML = "id";
                id.onclick = function () { chngsort(0, 1, "id"); };
                id.id = "id";
                if (sort_table == 0) {
                    id.innerHTML = "id" + arrowup;
                } else if (sort_table == 1) {
                    id.innerHTML = "id" + arrowdown;
                }
                trh.appendChild(id);
                let name = document.createElement("th");
                name.innerHTML = "name";
                name.onclick = function () { chngsort(2, 3, "name"); };
                name.id = "name";
                if (sort_table == 2) {
                    name.innerHTML = "name" + arrowup;
                } else if (sort_table == 3) {
                    name.innerHTML = "name" + arrowdown;
                }
                trh.appendChild(name);
                let inst = document.createElement("th");
                inst.innerHTML = "Box_group";
                inst.onclick = function () { chngsort(4, 5, "bg"); };
                inst.id = "bg";
                if (sort_table == 4) {
                    inst.innerHTML = "Box_group" + arrowup;
                } else if (sort_table == 5) {
                    inst.innerHTML = "Box_group" + arrowdown;
                }
                trh.appendChild(inst);
                let weight = document.createElement("th");
                weight.innerHTML = "weight";
                weight.onclick = function () { chngsort(6, 7, "weight"); };
                weight.id = "weight";
                if (sort_table == 12) {
                    weight.innerHTML = "weight" + arrowup;
                } else if (sort_table == 13) {
                    weight.innerHTML = "weight" + arrowdown;
                }
                trh.appendChild(weight);
                data.forEach((value) => {
                    let tr = document.createElement("tr");
                    table.appendChild(tr);
                    let tid = document.createElement("td");
                    let item_link = document.createElement("a");
                    item_link.style.textDecoration = "none";
                    item_link.href = 'http://' + location.host + '/box?id=' + value.id;
                    item_link.innerHTML = value.id;
                    tid.appendChild(item_link);
                    tr.appendChild(tid);
                    let tname = document.createElement("td");
                    if (value.name != "" && value.name != "" && value.name != null) {
                        let name_link = document.createElement("a");
                        name_link.style.textDecoration = "none";
                        name_link.href = 'http://' + location.host + '/box?id=' + value.id;
                        name_link.innerHTML = value.name;
                        tname.appendChild(name_link);
                    }
                    tr.appendChild(tname);
                    let tinst = document.createElement("td");
                    if (value.instruction_id != "" && value.instruction_id != " " && value.instruction_id != null) {
                        let inst_link = document.createElement("a");
                        inst_link.style.textDecoration = "none";
                        inst_link.href = 'http://' + location.host + '/instruction?id=' + value.instruction_id;
                        inst_link.innerHTML = value.instruction_id;
                        tinst.appendChild(inst_link);
                    }
                    tr.appendChild(tinst);
                    let tweight = document.createElement("td");
                    tweight.innerHTML = value.weight;
                    tr.appendChild(tweight);
                });
            }
        });
    });
}

function box_group_overview() {
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    let sql = "SELECT * FROM box_group ";
    switch (sort_table) {
        case 0:
            sql += "ORDER BY box_group.id ASC";
            break;
        case 1:
            sql += "ORDER BY box_group.id DESC";
            break;
        case 2:
            sql += "ORDER BY box_group.name ASC";
            break;
        case 3:
            sql += "ORDER BY box_group.name DESC";
            break;
        case 4:
            sql += "ORDER BY box_group.location ASC";
            break;
        case 5:
            sql += "ORDER BY box_group.location DESC";
            break;
    }
    socket.once('connect', () => {
        socket.emit("sql_read", sql);
        socket.once("sql_r" + sql, (data) => {
            if (data == null || data == "") {
                let container = document.getElementById("table-container");
                let error = document.createElement("p");
                error.innerHTML = "Nothing for that object found";
                container.appendChild(error);
            } else {
                let container = document.getElementById("table-container");
                let table = document.createElement("table");
                table.style.width = "100%";
                container.appendChild(table);
                let trh = document.createElement("tr");
                table.appendChild(trh);
                let id = document.createElement("th");
                id.innerHTML = "id";
                id.onclick = function () { chngsort(0, 1, "id"); };
                id.id = "id";
                if (sort_table == 0) {
                    id.innerHTML = "id" + arrowup;
                } else if (sort_table == 1) {
                    id.innerHTML = "id" + arrowdown;
                }
                trh.appendChild(id);
                let name = document.createElement("th");
                name.innerHTML = "name";
                name.onclick = function () { chngsort(2, 3, "name"); };
                name.id = "name";
                if (sort_table == 2) {
                    name.innerHTML = "name" + arrowup;
                } else if (sort_table == 3) {
                    name.innerHTML = "name" + arrowdown;
                }
                trh.appendChild(name);
                let inst = document.createElement("th");
                inst.innerHTML = "location";
                inst.onclick = function () { chngsort(4, 5, "location"); };
                inst.id = "location";
                if (sort_table == 4) {
                    inst.innerHTML = "location" + arrowup;
                } else if (sort_table == 5) {
                    inst.innerHTML = "location" + arrowdown;
                }
                trh.appendChild(inst);
                data.forEach((value) => {
                    let tr = document.createElement("tr");
                    table.appendChild(tr);
                    let tid = document.createElement("td");
                    let item_link = document.createElement("a");
                    item_link.style.textDecoration = "none";
                    item_link.href = 'http://' + location.host + '/box?id=' + value.id;
                    item_link.innerHTML = value.id;
                    tid.appendChild(item_link);
                    tr.appendChild(tid);
                    let tname = document.createElement("td");
                    if (value.name != "" && value.name != "" && value.name != null) {
                        let name_link = document.createElement("a");
                        name_link.style.textDecoration = "none";
                        name_link.href = 'http://' + location.host + '/box?id=' + value.id;
                        name_link.innerHTML = value.name;
                        tname.appendChild(name_link);
                    }
                    tr.appendChild(tname);
                    let tlocation = document.createElement("td");
                    tlocation.innerHTML = value.location;
                    tr.appendChild(tlocation);
                });
            }
        });
    });
}