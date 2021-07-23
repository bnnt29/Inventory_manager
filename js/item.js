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
            socket.emit('getItem_data', id);
            socket.on('getUnit', (dat) => {
                socket.on("item" + id, (data) => {
                    if (data.length != 0) {
                        data.forEach((values) => {
                            document.getElementById("title").innerHTML = values.item_name;
                            document.getElementById("item_id").innerHTML = id;
                            document.getElementById("item_name").innerHTML = values.item_name;
                            document.getElementById("total_quantity").innerHTML = values.total_quantity;
                            document.getElementById("item_img").alt = values.item_name;
                            let i = parseFloat(values.size);
                            let shortest = [];
                            let units = [];
                            let b = false;
                            if (dat != null) {
                                dat.forEach((val) => {
                                    shortest = [...shortest, "" + i / parseFloat(val.multiplicator)];
                                    units = [...units, val];
                                    b = true;
                                });
                            } else {
                                socket.emit('refresh', true);
                                socket.on('reloaded', (a) => {
                                    socket.on('getUnit', (dat) => {
                                        if (dat != null) {
                                            dat.forEach((val) => {
                                                shortest = [...shortest, "" + i / parseFloat(val.multiplicator)];
                                                units = [...units, val];
                                                b = true;
                                            });
                                        }
                                    });
                                });
                            }
                            if (b) {
                                let unit = 0;
                                for (let i = 0; i < shortest.length; i++) {
                                    if (shortest[unit].length > shortest[i].length) {
                                        unit = i;
                                    }
                                }
                                document.getElementById("item_size").innerHTML = i / (parseFloat(dat[unit].multiplicator));
                                document.getElementById("item_unit").innerHTML = dat[unit].name;
                            } else {
                                console.log("Unit konnte nicht geladen werden.")
                                document.getElementById("item_size").innerHTML = values.size;
                                document.getElementById("item_unit").innerHTML = "cm";
                            }
                            if (values.picture != null) {
                                document.getElementById("item_img").src = values.picture;
                                document.getElementById("item_picture").innerHTML = values.picture;
                            } else {
                                document.getElementById("item_picture").innerHTML = "undefined";
                            }
                            if (values.color != null) {
                                document.getElementById("color_row").style.backgroundColor = values.color;
                                document.getElementById("item_color").innerHTML = values.color;
                                if (values.color === "#ffffff") {
                                    document.getElementById("item_color").style.color = "#000000";
                                } else {
                                    document.getElementById("item_color").style.color = values.color;
                                }
                            }
                            socket.emit("sql_read", "SELECT * FROM instructions WHERE id ='" + parseInt(values.instructions_id) + "'");
                            socket.on("sql_r" + "SELECT * FROM instructions WHERE id ='" + parseInt(values.instructions_id) + "'", (data) => {
                                data.forEach((values) => {
                                    document.getElementById("text").innerHTML = values.name;
                                    socket.emit('getfile', "/../user_data/_txt/" + values.document);
                                    socket.on("get_f" + "/../user_data/_txt/" + values.document, (dat) => {
                                        document.getElementById("textarea").value = dat;
                                        document.getElementById("textarea").setAttribute("data-path", values.document);
                                        document.getElementById("textarea").setAttribute("data-or", dat);
                                        document.getElementById("textarea").style.display = "block";
                                    });
                                });
                            });
                        });
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
                socket.on("sql_r" + "SELECT * FROM item WHERE name='" + name + "'", (data) => {
                    if (data.length <= 0) {
                        let dat = [];
                        dat = ["UPDATE item SET name ='" + name + "' WHERE id = '" + id + "'", dat];
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
                socket.on("sql_i" + dat, (data) => { location.reload(); });
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
                            size = (size / 1000);
                            let dat = [];
                            dat = ["UPDATE item SET size ='" + size + "' WHERE id = '" + id + "'", dat];
                            socket.emit("sql_insert", dat);
                            socket.on("sql_i" + dat, (data) => { location.reload(); });
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

function change_item_inst(a) {
    if (a === 'true') {
        var txt = document.getElementById("textarea").value;
        var inst = document.getElementById("inst_edit_form").value;
        var name = document.getElementById("inst_edit").value;
        if (txt != document.getElementById("textarea").getAttribute("data-or")) {
            var ip = location.host;
            var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
            socket.on('connect', () => {
                socket.on('getdocuments', (data) => {
                    let b = false;
                    for (let i = 0; i < data; i + 2) {
                        let values = [data[i], data[i + 1]];
                        if (values[0] == txt) {
                            let datas = [];
                            datas = ["UPDATE item SET instructions_id ='" + values[1] + "' WHERE id = '" + id + "'", datas];
                            b = true;
                            socket.emit("sql_insert", datas);
                            socket.on("sql_i" + datas, (data) => { location.reload(); });
                        }
                    }
                    if (!b) {
                        var ip = location.host;
                        var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
                        if (name != "") {
                            let datas;
                            datas = [name, [id], txt, txt.length];
                            b = true;
                            socket.emit('instruction_data', datas);
                            socket.on("successinst", (data) => { location.reload(); });
                        } else {
                            if (inst == document.getElementById("text").innerHTML) {
                                let datas = [document.getElementById("textarea").getAttribute("data-path"), txt];
                                b = true;
                                socket.emit('setfile', datas);
                                socket.on("set_f" + datas, (data) => { location.reload(); });
                            } else {
                                var ip = location.host;
                                var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
                                socket.on('connect', () => {
                                    socket.emit("sql_read", "SELECT * FROM instructions WHERE name ='" + inst + "'");
                                    socket.on("sql_r" + "SELECT * FROM instructions WHERE name ='" + inst + "'", (data) => {
                                        data.forEach((values) => {
                                            let dat = [];
                                            dat = ["UPDATE item SET instructions_id ='" + values.id + "' WHERE id = '" + id + "'", dat];
                                            socket.emit("sql_insert", dat);
                                            socket.on("sql_i" + dat, (data) => { location.reload(); });
                                        });
                                    });
                                });
                            }
                        }
                    } else {
                    }
                });
            });
        } else {
            if (name != "") {
                var ip = location.host;
                var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
                socket.on('connect', () => {
                    socket.emit("sql_read", "SELECT * FROM instructions WHERE name ='" + inst + "'");
                    socket.on("sql_r" + "SELECT * FROM instructions WHERE name ='" + inst + "'", (data) => {
                        data.forEach((values) => {
                            let dat = [];
                            dat = ["UPDATE instructions SET name ='" + name + "' WHERE id = '" + values.id + "'", dat];
                            socket.emit("sql_insert", dat);
                            socket.on("sql_i" + dat, (data) => { location.reload(); });
                        });
                    });
                });
            } else {
                if (inst != document.getElementById("text").innerHTML) {
                    var ip = location.host;
                    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
                    socket.on('connect', () => {
                        socket.emit("sql_read", "SELECT * FROM instructions WHERE name ='" + inst + "'");
                        socket.on("sql_r" + "SELECT * FROM instructions WHERE name ='" + inst + "'", (data) => {
                            data.forEach((values) => {
                                let dat = [];
                                dat = ["UPDATE item SET instructions_id ='" + values.id + "' WHERE id = '" + id + "'", dat];
                                socket.emit("sql_insert", dat);
                                socket.on("sql_i" + dat, (data) => { location.reload(); });
                            });
                        });
                    });
                } else {
                    location.reload();
                }
            }
        }
    } else {
        document.getElementById("edit_pen_inst").disabled = true;
        document.getElementById("edit_pen_inst").style.display = "none";
        document.getElementById("edit_save_inst").style.display = "block";
        document.getElementById("edit_save_inst").disabled = false;
        document.getElementById("textarea").style.display = "block";
        document.getElementById("textarea").readOnly = false;

        var ip = location.host;
        var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
        socket.on('connect', () => {
            socket.on('getinstructions', (data) => {
                let form = document.createElement("form");
                form.id = "item_inst_edit";
                let label = document.createElement("label");
                label.htmlFor = "inst";
                form.appendChild(label);
                let select = document.createElement("select");
                select.id = "inst_edit_form";
                select.name = "inst_edit";
                select.style.width = "5rem";
                select.style.height = "3rem";
                select.onchange = () => { txtchange(); };
                label.appendChild(select);
                document.getElementById("text").style.display = "none";
                document.getElementById("text").parentElement.appendChild(form);
                data.forEach((values) => {
                    let option = document.createElement("option");
                    select.appendChild(option);
                    option.value = values.name;
                    option.id = values.id;
                    option.innerHTML = values.name;
                });
                let input = document.createElement("input");
                input.type = "text";
                input.id = "inst_edit"
                input.style.width = "16rem";
                input.style.height = "3rem";
                input.title = "instruction name";
                input.placeholder = "name";
                document.getElementById("text").parentElement.appendChild(input);
                select.value = document.getElementById("text").innerHTML;
            });
        });
    }
}


function txtchange() {
    let select = document.getElementById("inst_edit_form");
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.on('connect', () => {
        socket.emit("sql_read", "SELECT * FROM instructions WHERE name ='" + select.value + "'");
        socket.on("sql_r" + "SELECT * FROM instructions WHERE name ='" + select.value + "'", (data) => {
            data.forEach((values) => {
                socket.emit('getfile', "/../user_data/_txt/" + values.document);
                socket.on("get_f" + "/../user_data/_txt/" + values.document, (dat) => {
                    document.getElementById("textarea").value = dat;
                    document.getElementById("textarea").setAttribute("data-path", values.document);
                    document.getElementById("textarea").setAttribute("data-or", dat);
                    document.getElementById("textarea").style.display = "block";
                });
            });
        });
    });
}

function change_item_color(a) {
    if (a === 'true') {
        var color = document.getElementById("item_color_edit").value;
        document.getElementById("item_color_edit").value = color;
        if (color != "") {
            var ip = location.host;
            var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
            socket.on('connect', () => {
                let dat = [];
                dat = ["UPDATE item SET color ='" + color + "' WHERE id = '" + id + "'", dat];
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
        input.id = "item_color_edit"
        input.style.width = "16rem";
        input.style.height = "3rem";
        input.title = "item color";
        input.placeholder = "color";
        input.value = document.getElementById("item_color").innerHTML;
        document.getElementById("item_color").style.display = "none";
        document.getElementById("item_color").parentElement.appendChild(input);
    }
}


function change_item_picture(a) {
    if (a === 'true') {
        var pic = document.getElementById("item_pic_edit").files;
        if (pic != "") {
            var ip = location.host;
            var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
            socket.on('connect', () => {
                let dat = [];
                console.log(['item&' + id + '.jpg', pic[0]]);
                socket.emit('setpicture', ["item&" + id + '.jpg', pic[0]]);
                dat = ["UPDATE item SET picture ='" + "item&" + id + ".jpg" + "' WHERE id = '" + id + "'", dat];
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
        input.id = "item_pic_edit"
        input.style.width = "16rem";
        input.style.height = "3rem";
        input.title = "item pic";
        input.placeholder = "item";
        document.getElementById("item_picture").style.display = "none";
        document.getElementById("item_picture").parentElement.appendChild(input);
    }
}

