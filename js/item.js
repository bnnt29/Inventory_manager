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
            dat = "SELECT * FROM item WHERE name='" + dat + "'";
            socket.emit('sql_read', dat);
            socket.on(dat, (data) => {
                console.log("4");
                console.log(data);
                data.forEach((values) => {
                    console.log("3");
                    console.log(values);
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
            socket.emit('getItem_data', id);
            socket.on('getUnit', (dat) => {
                socket.on(id, (data) => {
                    if (data.length != 0) {
                        data.forEach((values) => {
                            document.getElementById("item_id").innerHTML = id;
                            document.getElementById("item_name").innerHTML = values.item_name;
                            document.getElementById("total_quantity").innerHTML = values.total_quantity;
                            document.getElementById("item_img").alt = values.item_name;
                            let i = parseFloat(values.size);
                            let shortest = [];
                            let units = [];
                            dat.forEach((val) => {
                                shortest = [...shortest, "" + i / parseFloat(val.multiplicator)];
                                units = [...units, val];
                            });
                            let unit = 0;
                            for (let i = 0; i < shortest.length; i++) {
                                if (shortest[unit].length > shortest[i].length) {
                                    unit = i;
                                }
                            }
                            document.getElementById("item_size").innerHTML = parseFloat(values.size) / (parseFloat(dat[unit].multiplicator));
                            document.getElementById("item_unit").innerHTML = dat[unit].name;
                            if (values.picture != null) {
                                document.getElementById("item_img").src = values.picture;
                            }
                            if (values.color != null) {
                                document.getElementById("color_row").style.backgroundColor = values.color;
                            }
                        });
                        init_tab_links(data);
                    } else {
                        console.log("none");
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
    var img = document.getElementById("item_img");
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
    let button;
    let b = false;
    let bd_ids = [];
    let tabc;
    data.forEach((values) => {
        if (bd_ids.includes(values.box_group_id)) {
            init_box_coll(tabc, values);
        } else {
            bd_ids = [...bd_ids, parseInt(values.box_group_id)];
            if (values.box_id != null) {
                document.getElementById("setup").style.display = "block";
            } else {
                document.getElementById("setup").style.display = "none";
            }
            let parent = document.getElementById("tablinks_div");
            button = document.createElement("button");
            button.classList.add("tablinks");
            button.setAttribute("data-id", values.box_group_id);
            button.innerHTML = values.bg_name;
            button.onclick = () => { opentab(event, values.box_group_id); };
            if (values.bg_color != null) {
                button.style.backgroundColor = values.bg_color;
            } else {
                button.style.backgroundColor = "#FFFFFF";
            }
            let def = document.getElementById("default");
            parent.appendChild(button);
            b = true;

            let col_lg_12 = document.getElementById("tabs");
            tabc = document.createElement("div");
            tabc.classList.add("tabcontent");
            tabc.id = values.box_group_id;
            col_lg_12.appendChild(tabc);
            init_box_coll(tabc, values);
        }
    });
}

function init_box_coll(tabc, values) {
    let but = document.createElement("button");
    but.type = "button";
    but.classList.add("collapsible");
    but.innerHTML = values.box_name;
    if (values.box_color != null) {
        but.style.backgroundColor = values.box_color;
    } else {
        but.style.backgroundColor = "#FFFFFF";
    }
    tabc.appendChild(but);
    let content = document.createElement("div");
    content.classList.add("content");
    content.id = values.box_name;
    content.setAttribute("data-id", values.box_id);
    content.style.display = "none";
    tabc.append(content);
    init_item_row(content, values);
    init_collapse(but);
}

function init_item_row(content, values) {

    let row = document.createElement("div");
    row.classList.add("row");
    content.appendChild(row);
    let col_lg_12 = document.createElement("div");
    col_lg_12.classList.add("col-lg-12");
    col_lg_12.id = values.item_name;
    row.appendChild(col_lg_12);
    row = document.createElement("div");
    row.classList.add("row");
    row.style.marginTop = "1rem";

    col_lg_12.appendChild(row);
    let col_lg_6 = document.createElement("div");
    col_lg_6.classList.add("col-lg-6");
    row.appendChild(col_lg_6);
    let p = document.createElement("p");
    p.innerHTML = values.item_name;
    col_lg_6.appendChild(p);
    col_lg_6 = document.createElement("div");
    col_lg_6.classList.add("col-lg-6");
    row.appendChild(col_lg_6);
    p = document.createElement("p");
    p.innerHTML = values.quantity;
    col_lg_6.appendChild(p);
}

function opentab(evt, tabName) {

    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

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

function change_item_name(a) {
    if (a === 'true') {
        var name = document.getElementById("item_name_edit").value;
        document.getElementById("item_name").value = name;
        document.getElementById("item_name_edit").value = name;
        if (name != "") {
            var ip = location.host;
            var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
            socket.on('connect', () => {
                socket.emit("sql_read", "SELECT * FROM item WHERE name='" + name + "'");
                socket.on("SELECT * FROM item WHERE name='" + name + "'", (data) => {
                    if (data.length <= 0) {
                        let dat = [];
                        dat = ["UPDATE item SET name ='" + name + "' WHERE id = '" + id + "'", dat];
                        socket.emit("sql_insert", dat);
                        socket.on(dat, (data) => { location.reload(); });
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
        input.id = "item_name_edit"
        input.style.width = "16rem";
        input.style.height = "3rem";
        input.title = "item name";
        input.placeholder = "name";
        document.getElementById("item_name").style.display = "none";
        document.getElementById("item_name").parentElement.appendChild(input);
    }
}

function change_item_quantity(a) {
    if (a === 'true') {
        var quantity = document.getElementById("total_quantity_edit").value;
        document.getElementById("total_quantity").value = quantity;
        document.getElementById("total_quantity_edit").value = quantity;
        if (quantity != "") {
            var ip = location.host;
            var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
            socket.on('connect', () => {
                let dat = [];
                dat = ["UPDATE item SET total_quantity ='" + quantity + "' WHERE id = '" + id + "'", dat];
                socket.emit("sql_insert", dat);
                socket.on(dat, (data) => { location.reload(); });
            });
        } else {
            location.reload();
        }
    } else {
        document.getElementById("edit_pen_quantity").disabled = true;
        document.getElementById("edit_pen_quantity").style.display = "none";
        document.getElementById("edit_save_quantity").style.display = "block";
        document.getElementById("edit_save_quantity").disabled = false;
        let input = document.createElement("input");
        input.type = "number";
        input.id = "total_quantity_edit"
        input.style.width = "16rem";
        input.style.height = "3rem";
        input.title = "total quantity";
        input.placeholder = "0";
        document.getElementById("total_quantity").style.display = "none";
        document.getElementById("total_quantity").parentElement.appendChild(input);
    }
}

function change_item_size(a) {
    if (a === 'true') {
        var size = document.getElementById("item_size_edit").value;
        document.getElementById("item_size").value = size;
        document.getElementById("item_size_edit").value = size;
        var unit = document.getElementById("unit").value;
        document.getElementById("unit").value = "mm";
        if (size != "") {
            var ip = location.host;
            var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
            socket.on('connect', () => {
                socket.on('getUnit', (data) => {
                    data.forEach((values) => {
                        if (unit === values.name) {
                            size = size * parseFloat(values.multiplicator);
                            size = ~~(size * 1000);
                            let dat = [];
                            dat = ["UPDATE item SET size ='" + size + "' WHERE id = '" + id + "'", dat];
                            socket.emit("sql_insert", dat);
                            socket.on(dat, (data) => { location.reload(); });
                        }
                    });
                })
            });
        } else {
            location.reload();
        }
    } else {
        document.getElementById("edit_pen_size").disabled = true;
        document.getElementById("edit_pen_size").style.display = "none";
        document.getElementById("edit_save_size").style.display = "block";
        document.getElementById("edit_save_size").disabled = false;
        let input = document.createElement("input");
        input.type = "number";
        input.id = "item_size_edit"
        input.style.width = "16rem";
        input.style.height = "3rem";
        input.title = "item size";
        input.placeholder = "0";
        document.getElementById("item_size").style.display = "none";
        document.getElementById("item_size").parentElement.appendChild(input);
        var ip = location.host;
        var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
        socket.on('connect', () => {
            socket.on('getUnit', (data) => {
                let form = document.createElement("form");
                form.id = "item_unit_edit";
                let label = document.createElement("label");
                label.htmlFor = "unit";
                form.appendChild(label);
                let select = document.createElement("select");
                select.id = "unit";
                select.name = "unit";
                select.style.width = "5rem";
                select.style.height = "3rem";
                label.appendChild(select);
                data.forEach((values) => {
                    let option = document.createElement("option");
                    select.appendChild(option);
                    option.value = values.name;
                    option.innerHTML = values.name;
                });
                document.getElementById("item_unit").style.display = "none";
                document.getElementById("item_unit").parentElement.appendChild(form);
            });
        });
    }
}

