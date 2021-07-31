var url = document.URL;
var id = -1;

function getid(url) {
    if (url.indexOf("&") != -1) {
        if (!isNaN(url.substring(url.indexOf("&") + 1, url.length))) {
            ids = url.substring(url.indexOf("&") + 1, url.length);
            id = parseInt(ids);
            init_f(id);
            return id;
        }
    } else if (url.indexOf("+") != -1) {
        var ip = location.host;
        var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
        socket.on('connect', () => {
            let dat = url.substring(url.indexOf("+") + 1, url.length);
            dat = "SELECT * FROM box_group WHERE name='" + dat + "'";
            socket.emit('sql_read', dat);
            socket.on("sql_r" + dat, (data) => {
                data.forEach((values) => {
                    if (values.name == url.substring(url.indexOf("+") + 1, url.length)) {
                        id = values.id;
                        init_f(id);
                        return id;
                    }
                });
            });
        });
    } else {
        nofile();
        return -1;
    }
}

function init() {
    url = document.URL;
    getid(url);
    init_picture();
}

function init_f(id) {
    if (id >= 1) {
        var ip = location.host;
        var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
        socket.on('connect', () => {
            socket.emit('getBoxgroup_data', id);
            socket.on('getweight_Unit', (dats) => {
                socket.on("box_group" + id, (data) => {
                    if (data.length != 0) {
                        console.log(data);
                        let weight = 0;
                        let price = 0;
                        let bd_ids = [];
                        document.getElementById("total_items").innerHTML = data.length;
                        data.forEach((values) => {
                            if (values.i_weight != null) {
                                weight += values.i_weight;
                            }
                            if (!bd_ids.includes(values.b_id)) {
                                weight += values.b_weight;
                            }
                            if (values.i_price != null) {
                                price += values.i_price;
                            }
                            document.getElementById("box_group_id").innerHTML = values.bg_id;
                            document.getElementById("box_group_name").innerHTML = values.bg_name;
                            document.getElementById("box_group_img").alt = values.bg_name;
                            document.getElementById("box_group_location").innerHTML = values.bg_location;
                            if (values.bg_picture != null) {
                                document.getElementById("box_group_img").src = values.bg_picture;
                                document.getElementById("box_group_picture").innerHTML = values.bg_picture;
                            } else {
                                document.getElementById("box_group_picture").innerHTML = "undefined";
                            }
                            if (values.bg_color != null) {
                                document.getElementById("color_row").style.backgroundColor = values.bg_color;
                                document.getElementById("box_group_color").innerHTML = values.bg_color;
                                if (values.bg_color === "#ffffff") {
                                    document.getElementById("box_group_color").style.color = "#000000";
                                } else {
                                    document.getElementById("box_group_color").style.color = values.bg_color;
                                }
                            } else {
                                document.getElementById("box_group_color").innerHTML = "#000000";
                            }
                        });
                        weight += data[0].b_weight;
                        let shortest_weight = [];
                        let units_weight = [];
                        let b = false;
                        i = parseFloat(weight);
                        b = false;
                        if (dats != null) {
                            dats.forEach((val) => {
                                shortest_weight = [...shortest_weight, "" + i / parseFloat(val.multiplicator)];
                                units_weight = [...units_weight, val];
                                b = true;
                            });
                        } else {
                            socket.emit('refresh', true);
                            socket.on('reloaded', (a) => {
                                socket.on('getweight_Unit', (dats) => {
                                    if (dats != null) {
                                        dats.forEach((val) => {
                                            shortest_weight = [...shortest_weight, "" + i / parseFloat(val.multiplicator)];
                                            units_weight = [...units_weight, val];
                                            b = true;
                                        });
                                    }
                                });
                            });
                        }
                        if (b) {
                            let unit = 0;
                            for (let i = 0; i < shortest_weight.length; i++) {
                                if (shortest_weight[unit].length > shortest_weight[i].length) {
                                    unit = i;
                                }
                            }
                            document.getElementById("total_weight").innerHTML = i / (parseFloat(dats[unit].multiplicator));
                            document.getElementById("total_weight_unit").innerHTML = dats[unit].name;
                        } else {
                            console.log("Unit konnte nicht geladen werden.");
                            document.getElementById("total_weight").innerHTML = values.size;
                            document.getElementById("total_weight_unit").innerHTML = "g";
                        }
                        document.getElementById("total_price").innerHTML = price;
                        document.getElementById("total_box").innerHTML = 0;
                        init_tab_links(data);
                    } else {
                        document.getElementById("body").style.display = "none";
                        document.getElementById("html").innerHTML = "The item with the id: " + id + " doesn't exist";
                    }
                });
            });
        });
    }
}

function nofile() {
    document.write("opps this doesn't exist - 404  -  (tipp: use /item&[item_id])");
}

function init_picture() {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var img = document.getElementById("box_group_img");
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    img.onclick = function () {
        modal.style.display = "block";
        modalImg.src = this.src;
        captionText.innerHTML = this.alt;
    }

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }
}

function init_tab_links(data) {
    let bd_ids = [];
    let tabc = document.getElementById("tablinks_div");
    let content;
    data.forEach((values) => {
        if (bd_ids.includes(values.b_id)) {
            init_item_row(content, values);
        } else {
            bd_ids = [...bd_ids, values.b_id];
            let but = document.createElement("button");
            but.type = "button";
            but.classList.add("collapsible");
            but.innerHTML = values.b_name;
            but.style.backgroundColor = "#FFFFFF";
            tabc.appendChild(but);
            content = document.createElement("div");
            content.classList.add("content");
            content.id = values.b_name;
            content.setAttribute("data-id", values.b_id);
            content.style.display = "none";
            tabc.append(content);
            init_item_row(content, values);
            init_collapse(but);
        }
    });
    document.getElementById("total_box").innerHTML = bd_ids.length;
}

function init_item_row(content, values) {

    let row = document.createElement("div");
    row.classList.add("row");
    content.appendChild(row);
    let a = document.createElement("a");
    a.href = 'http://' + location.host + '/item&' + values.i_id;
    if (values.i_color === "#ffffff") {
        a.style.color = "#000000";
    } else {
        a.style.color = values.i_color;
    }
    a.style.textDecoration = "none";
    a.style.width = "100%";
    row.appendChild(a);
    let col_lg_12 = document.createElement("div");
    col_lg_12.classList.add("col-lg-12");
    col_lg_12.id = values.i_name;
    a.appendChild(col_lg_12);
    row = document.createElement("div");
    row.classList.add("row");
    row.style.marginTop = "1rem";

    col_lg_12.appendChild(row);
    let col_lg_6 = document.createElement("div");
    col_lg_6.classList.add("col-lg-6");
    row.appendChild(col_lg_6);
    let p = document.createElement("p");
    p.innerHTML = values.i_name;
    col_lg_6.appendChild(p);
    col_lg_6 = document.createElement("div");
    col_lg_6.classList.add("col-lg-6");
    row.appendChild(col_lg_6);
    p = document.createElement("p");
    p.innerHTML = values.ib_quantity;
    col_lg_6.appendChild(p);
}

function init_collapse(a) {
    a.addEventListener("click", function () {
        let content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}

function refresh() {
    var refresh = false;
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.on('connect', () => {
        if (!refresh) {
            socket.emit('refresh', true);
            socket.on('reloaded', (data) => {
                refresh = true;
                location.reload();
            })
        }
    });
}

function change_box_group_name(a) {
    if (a === 'true') {
        var name = document.getElementById("box_group_name_edit").value;
        document.getElementById("box_group_name").value = name;
        document.getElementById("box_group_name_edit").value = name;
        if (name != "") {
            var ip = location.host;
            var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
            socket.on('connect', () => {
                socket.emit("sql_read", "SELECT * FROM box_group WHERE name='" + name + "'");
                socket.on("sql_r" + "SELECT * FROM box_group WHERE name='" + name + "'", (data) => {
                    if (data.length <= 0) {
                        let dat = [];
                        dat = ["UPDATE box_group SET name ='" + name + "' WHERE id = '" + id + "'", dat];
                        socket.emit("sql_insert", dat);
                        socket.on("sql_i" + dat, (data) => { location.reload(); });
                    } else {
                        console.log("Name already exist");
                    }
                });
            });
        } else {
            location.reload();
        }
    } else {
        document.getElementById("edit_pen_name").disabled = true;
        document.getElementById("edit_pen_name").style.display = "none";
        document.getElementById("edit_save_name").style.display = "block";
        document.getElementById("edit_save_name").disabled = true;
        let input = document.createElement("input");
        input.type = "text";
        input.id = "box_group_name_edit"
        input.style.width = "16rem";
        input.style.height = "3rem";
        input.title = "box group name";
        input.placeholder = "name";
        document.getElementById("box_group_name").style.display = "none";
        document.getElementById("box_group_name").parentElement.appendChild(input);
    }
}

function change_box_group_location(a) {
    if (a === 'true') {
        var locations = document.getElementById("box_group_location_edit").value;
        document.getElementById("box_group_location").value = locations;
        document.getElementById("box_group_location_edit").value = locations;
        if (locations != "") {
            var ip = location.host;
            var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
            socket.on('connect', () => {
                let dat = [];
                dat = ["UPDATE box_group SET location ='" + locations + "' WHERE id = '" + id + "'", dat];
                socket.emit("sql_insert", dat);
                socket.on("sql_i" + dat, (data) => { location.reload(); });
            });
        } else {
            location.reload();
        }
    } else {
        document.getElementById("edit_pen_location").disabled = true;
        document.getElementById("edit_pen_location").style.display = "none";
        document.getElementById("edit_save_location").style.display = "block";
        document.getElementById("edit_save_location").disabled = true;
        let input = document.createElement("input");
        input.type = "text";
        input.id = "box_group_location_edit"
        input.style.width = "16rem";
        input.style.height = "3rem";
        input.title = "box group location";
        input.placeholder = "location";
        document.getElementById("box_group_location").style.display = "none";
        document.getElementById("box_group_location").parentElement.appendChild(input);
    }
}

function change_box_group_color(a) {
    if (a === 'true') {
        var color = document.getElementById("box_group_color_edit").value;
        document.getElementById("box_group_color_edit").value = color;
        if (color != "") {
            var ip = location.host;
            var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
            socket.on('connect', () => {
                let dat = [];
                dat = ["UPDATE box_group SET color ='" + color + "' WHERE id = '" + id + "'", dat];
                socket.emit("sql_insert", dat);
                socket.on("sql_i" + dat, (data) => { location.reload(); });
            });
        } else {
            location.reload();
        }
    } else {
        document.getElementById("edit_pen_color").disabled = true;
        document.getElementById("edit_pen_color").style.display = "none";
        document.getElementById("edit_save_color").style.display = "block";
        document.getElementById("edit_save_color").disabled = true;
        let input = document.createElement("input");
        input.type = "color";
        input.id = "box_group_color_edit"
        input.style.width = "16rem";
        input.style.height = "3rem";
        input.title = "box group color";
        input.placeholder = "color";
        input.value = document.getElementById("box_group_color").innerHTML;
        document.getElementById("box_group_color").style.display = "none";
        document.getElementById("box_group_color").parentElement.appendChild(input);
    }
}

function change_box_group_picture(a) {
    if (a === 'true') {
        var pic = document.getElementById("box_group_pic_edit").files;
        if (pic != "") {
            var ip = location.host;
            var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
            socket.on('connect', () => {
                let dat = [];
                socket.emit('setpicture', ['boxgroup&' + id + '.jpg', pic[0]]);
                dat = ["UPDATE box_group SET picture ='" + "boxgroup&" + id + ".jpg" + "' WHERE id = '" + id + "'", dat];
                socket.emit("sql_insert", dat);
                socket.on("sql_i" + dat, (data) => { location.reload(); });
            });
        } else {
            location.reload();
        }
    } else {
        document.getElementById("edit_pen_picture").disabled = true;
        document.getElementById("edit_pen_picture").style.display = "none";
        document.getElementById("edit_save_picture").style.display = "block";
        document.getElementById("edit_save_picture").disabled = true;
        let input = document.createElement("input");
        input.type = "file";
        input.accept = ".jpg";
        input.id = "box_group_pic_edit"
        input.style.width = "16rem";
        input.style.height = "3rem";
        input.title = "box group pic";
        input.placeholder = "pic";
        document.getElementById("box_group_picture").style.display = "none";
        document.getElementById("box_group_picture").parentElement.appendChild(input);
    }
}