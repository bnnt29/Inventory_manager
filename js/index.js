var sort_table = 0;
var arrowup = "&#9650";
var arrowdown = "&#9660";
function onChange() {
    document.getElementById("table-container").innerHTML = null;
    switch (document.getElementById("category").value) {
        case "Item":
            item_overview();
            break;
        case "Box":
            box_overview();
            break;
        case "Box_group":
            box_group_overview();
            break;
        case "in_use":
            break;
        case "events":
            break;
    }
}

function chngsort(a, b, c) {
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
    let sql = "SELECT * FROM item ";
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
            sql += "ORDER BY item.size ASC";
            break;
        case 7:
            sql += "ORDER BY item.size DESC";
            break;
        case 8:
            sql += "ORDER BY item.total_quantity ASC";
            break;
        case 9:
            sql += "ORDER BY item.total_quantity DESC";
            break;
        case 10:
            sql += "ORDER BY item.price ASC";
            break;
        case 11:
            sql += "ORDER BY item.price DESC";
            break;
        case 12:
            sql += "ORDER BY item.weight ASC";
            break;
        case 13:
            sql += "ORDER BY item.weight DESC";
            break;
    }
    socket.on('connect', () => {
        socket.emit("sql_read", sql);
        socket.on("sql_r" + sql, (data) => {
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
                inst.innerHTML = "Instruction";
                inst.onclick = function () { chngsort(4, 5, "inst"); };
                inst.id = "inst";
                if (sort_table == 4) {
                    inst.innerHTML = "Instruction" + arrowup;
                } else if (sort_table == 5) {
                    inst.innerHTML = "Instruction" + arrowdown;
                }
                trh.appendChild(inst);
                let size = document.createElement("th");
                size.innerHTML = "size" + " (in cm) ";
                size.onclick = function () { chngsort(6, 7, "size"); };
                size.id = "size";
                if (sort_table == 6) {
                    size.innerHTML = "size" + " (in cm) " + arrowup;
                } else if (sort_table == 7) {
                    size.innerHTML = "size" + " (in cm) " + arrowdown;
                }
                trh.appendChild(size);
                let total = document.createElement("th");
                total.innerHTML = "total quantity";
                total.onclick = function () { chngsort(8, 9, "total"); };
                total.id = "total";
                if (sort_table == 8) {
                    total.innerHTML = "total quantity" + arrowup;
                } else if (sort_table == 9) {
                    total.innerHTML = "total quantity" + arrowdown;
                }
                trh.appendChild(total);
                let price = document.createElement("th");
                price.innerHTML = "price";
                price.onclick = function () { chngsort(10, 11, "price"); };
                price.id = "price";
                if (sort_table == 10) {
                    price.innerHTML = "price" + arrowup;
                } else if (sort_table == 11) {
                    price.innerHTML = "price" + arrowdown;
                }
                trh.appendChild(price);
                let weight = document.createElement("th");
                weight.innerHTML = "weight" + " (in kg) ";
                weight.onclick = function () { chngsort(12, 13, "weight"); };
                weight.id = "weight";
                if (sort_table == 12) {
                    weight.innerHTML = "weight" + " (in kg) " + arrowup;
                } else if (sort_table == 13) {
                    weight.innerHTML = "weight" + " (in kg) " + arrowdown;
                }
                trh.appendChild(weight);
                data.forEach((value) => {
                    let tr = document.createElement("tr");
                    table.appendChild(tr);
                    let tid = document.createElement("td");
                    let item_link = document.createElement("a");
                    item_link.style.textDecoration = "none";
                    item_link.href = 'http://' + location.host + '/item?id=' + value.id;
                    item_link.innerHTML = value.id;
                    tid.appendChild(item_link);
                    tr.appendChild(tid);
                    let tname = document.createElement("td");
                    if (value.name != "" && value.name != "" && value.name != null) {
                        let name_link = document.createElement("a");
                        name_link.style.textDecoration = "none";
                        name_link.href = 'http://' + location.host + '/item?id=' + value.id;
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
                    let tsize = document.createElement("td");
                    tsize.innerHTML = value.size;
                    tr.appendChild(tsize);
                    let ttotal = document.createElement("td");
                    ttotal.innerHTML = value.total_quantity;
                    tr.appendChild(ttotal);
                    let tprice = document.createElement("td");
                    tprice.innerHTML = value.price;
                    tr.appendChild(tprice);
                    let tweight = document.createElement("td");
                    tweight.innerHTML = value.weight;
                    tr.appendChild(tweight);
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
    socket.on('connect', () => {
        socket.emit("sql_read", sql);
        socket.on("sql_r" + sql, (data) => {
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
    socket.on('connect', () => {
        socket.emit("sql_read", sql);
        socket.on("sql_r" + sql, (data) => {
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