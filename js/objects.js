function onsizechange(a) {
    let a = document.getElementsByClassName("")
}

function addsize() {
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.once('connect', () => {
        socket.once('getouter_box', (data) => {
            socket.once('getconnection', (data) => {

            });
        });
    });
}

function getinstructions() {
    var instructions_get = false;
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.once('connect', () => {
        socket.once('getinstructions', (data) => {
            if (!instructions_get) {
                data.forEach(function (values) {
                    let parent = document.getElementById("instructions_select");
                    let option = document.createElement("option");
                    parent.appendChild(option);
                    option.value = values.id;
                    option.innerHTML = values.name;
                });
                data.forEach(function (values) {
                    let parent = document.getElementById("instructions_select_box");
                    let option = document.createElement("option");
                    parent.appendChild(option);
                    option.value = values.id;
                    option.innerHTML = values.name;
                });
                instructions_get = true;
            }
        })
    });
}

function getbox() {
    var box_get = false;
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.once('connect', () => {
        socket.once('getouterbox', (data) => {
            if (!box_get) {
                data.forEach(function (values) {
                    let parent = document.getElementById("outer_box_select");
                    let option = document.createElement("option");
                    parent.appendChild(option);
                    option.value = values.id;
                    option.innerHTML = values.name;
                });
                data.forEach(function (values) {
                    let parent = document.getElementById("box_select");
                    let option = document.createElement("option");
                    parent.appendChild(option);
                    option.value = values.id;
                    option.innerHTML = values.name;
                });
                document.getElementById("box_select").value = 1;
                document.getElementById("outer_box_select").value = 1;
                box_get = true;
            }
        })
    });
}

function getinnerbox() {
    var inner_box_get = false;
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.once('connect', () => {
        socket.once('getinnerbox', (data) => {
            if (!inner_box_get) {
                console.log(data);
                let container = document.getElementById("inner_box_container1");
                data.forEach(function (values) {
                    let row_container = document.createElement("div");
                    row_container.classList.add("row");
                    container.appendChild(row_container);
                    let col_lg_12 = document.createElement("div");
                    col_lg_12.classList.add("col-lg-12");
                    row_container.appendChild(col_lg_12);

                    let row1 = document.createElement("div");
                    row1.classList.add("row");
                    row1.style.marginTop = "1rem";
                    row1.style.marginBottom = "1rem";
                    col_lg_12.appendChild(row1);


                    let col_lg_6 = document.createElement("div");
                    col_lg_6.classList.add("col-lg-6");
                    row1.appendChild(col_lg_6);
                    let p = document.createElement("p");
                    p.innerHTML = values.name;
                    col_lg_6.appendChild(p);


                    col_lg_6 = document.createElement("div");
                    col_lg_6.classList.add("col-lg-6");
                    row1.appendChild(col_lg_6);
                    let row2 = document.createElement("div");
                    row2.classList.add("row");
                    col_lg_6.appendChild(row2);
                    col_lg_12 = document.createElement("div");
                    col_lg_12.classList.add("col-lg-12");
                    row2.appendChild(col_lg_12);

                    let input = document.createElement("div");
                    input.classList.add("input-group");
                    col_lg_12.appendChild(input);
                    let row3 = document.createElement("div");
                    row3.classList.add("row");
                    input.appendChild(row3);

                    col_lg_6 = document.createElement("div");
                    col_lg_6.classList.add("col-lg-6");
                    row3.appendChild(col_lg_6);

                    input = document.createElement("input");
                    input.classList.add("input-check-field");
                    input.classList.add("field_box");
                    input.setAttribute("data-id", values.id);
                    input.type = "checkbox";
                    input.id = values.id;
                    input.value = values.name;
                    input.name = values.name;
                    input.checked = false;
                    input.title = "checked:" + input.checked;
                    col_lg_6.appendChild(input);
                });
                inner_box_get = true;
            }
        })
    });
}

function getitem_node(a, b) {
    let item_getnode = false;
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.once('connect', () => {
        if (a == b) {
            socket.emit("in_use_box_node", b);
        }
        socket.once("" + b, (data) => {
            console.log(1);
            console.log(data);
            console.log(a + ", " + b);
            if (!item_getnode) {
                data.forEach(function (values) {
                    let container = document.getElementById(a);
                    let row_container = document.createElement("div");
                    row_container.classList.add("row");
                    container.appendChild(row_container);
                    let col_lg_12 = document.createElement("div");
                    col_lg_12.classList.add("col-lg-12");
                    row_container.appendChild(col_lg_12);

                    let row1 = document.createElement("div");
                    row1.classList.add("row");
                    row1.style.marginTop = "1rem";
                    row1.style.marginBottom = "1rem";
                    col_lg_12.appendChild(row1);


                    let col_lg_6 = document.createElement("div");
                    col_lg_6.classList.add("col-lg-6");
                    row1.appendChild(col_lg_6);
                    let p = document.createElement("p");
                    p.innerHTML = values.name;
                    col_lg_6.appendChild(p);


                    col_lg_6 = document.createElement("div");
                    col_lg_6.classList.add("col-lg-6");
                    row1.appendChild(col_lg_6);
                    let row2 = document.createElement("div");
                    row2.classList.add("row");
                    col_lg_6.appendChild(row2);
                    col_lg_12 = document.createElement("div");
                    col_lg_12.classList.add("col-lg-12");
                    row2.appendChild(col_lg_12);

                    let input = document.createElement("div");
                    input.classList.add("input-group");
                    input.classList.add("plus-minus-input");
                    col_lg_12.appendChild(input);
                    let row3 = document.createElement("div");
                    row3.classList.add("row");
                    input.appendChild(row3);

                    col_lg_6 = document.createElement("div");
                    col_lg_6.classList.add("col-lg-6");
                    row3.appendChild(col_lg_6);
                    let conts = "box_container1" + " " + "item_container2";
                    if (conts.indexOf(a) == -1) {
                        input = document.createElement("input");
                        input.classList.add("input-group-field");
                        input.classList.add("field_item");
                        input.type = "number";
                        input.name = values.name;
                        input.value = "0";
                        input.placeholder = "0";
                        input.title = "value";
                        if (a == "item_container1") {
                            var max = values.total_quantity;
                            var min = 0;
                            socket.emit("sql_read", "SELECT * FROM item_box WHERE item_id='" + values.id + "'");
                            socket.on("sql_r" + "SELECT * FROM item_box WHERE item_id='" + values.id + "' AND NOT box_id='1'", (data) => { data.forEach((dat) => { max -= parseInt(dat.quantity); }); });
                            input.setAttribute("data-max", max);
                            input.setAttribute("data-min", min);
                            input.addEventListener('change', () => { if (parseInt(input.value) > max) { input.value = max } if (parseInt(input.value) < min) { input.value = min } });
                        }
                        input.setAttribute("data-id", values.id);
                        input.style.width = "16rem";
                        input.style.height = "3rem";
                        input.style.alignSelf = "center";
                        col_lg_6.appendChild(input);
                    } else {
                        input = document.createElement("input");
                        input.classList.add("field_item");
                        input.setAttribute("data-id", values.id);
                        input.type = "checkbox";
                        input.id = values.id;
                        input.value = values.name;
                        input.name = values.name;
                        input.checked = false;
                        col_lg_6.appendChild(input);
                    }
                });
                item_getnode = true;
            }
        })
    });
}

function getbox_node(a, b) {
    let box_getnode = false;
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.once('connect', () => {
        socket.once(b, (data) => {
            console.log(data);
            if (!box_getnode) {
                data.forEach((values) => {
                    let parent = document.getElementById(a);
                    let div = document.createElement("div");
                    div.classList.add("col-lg-12");
                    parent.appendChild(div);
                    let button = document.createElement("button");
                    button.type = "button";
                    button.classList.add("collapsible");
                    button.classList.add("boxes");
                    button.innerHTML = values.name;
                    div.appendChild(button);
                    let div2 = document.createElement("div");
                    div2.classList.add("content");
                    div2.id = values.id;
                    div2.style.display = "none";
                    div.appendChild(div2);
                    getitem_node(values.id, values.id);
                });
                box_getnode = true;
                init_collapse();
            }
        })
    });
}

function getUnit() {
    var unit_get_size = false;
    var unit_get_weight = false;
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.once('connect', () => {
        socket.once('getsize_Unit', (data) => {
            if (!unit_get_size) {
                data.forEach(function (values) {
                    let parent = document.getElementById("unit_size");
                    let option = document.createElement("option");
                    parent.appendChild(option);
                    option.value = values.name;
                    option.innerHTML = values.name;
                });
                unit_get_size = true;
            }
        })
        socket.once('getweight_Unit', (data) => {
            if (!unit_get_weight) {
                data.forEach(function (values) {
                    let parent1 = document.getElementById("unit_weight");
                    let parent2 = document.getElementById("unit_box_weight");
                    let option1 = document.createElement("option");
                    parent1.appendChild(option1);
                    option1.value = values.name;
                    option1.innerHTML = values.name;
                    let option2 = document.createElement("option");
                    parent2.appendChild(option2);
                    option2.value = values.name;
                    option2.innerHTML = values.name;
                });
                unit_get_weight = true;
            }
        })
    });
}

function refresh() {
    var refresh = false;
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.once('connect', () => {
        if (!refresh) {
            socket.emit('refresh', true);
            socket.once('reloaded', (data) => {
                refresh = true;
                location.reload();
            })
        }
    });
}

function additem() {
    let name = document.getElementById("item_name").value;
    document.getElementById("item_name").value = "";
    let instructions = parseInt(document.getElementById("item_instruction").value);
    document.getElementById("item_instruction").value = "Instruction";
    let color = document.getElementById("item_color").value;
    document.getElementById("item_color").value = "#FFFFFF";
    let pictures = document.getElementById("item_picture").files;

    let size_count = document.getElementsByClassName("item_size_count").length;
    let size_sizesX = [];
    document.getElementsByClassName("size_sizesX").forEach((sizex) => {
        if (sizex.value == null || sizex.value.length == 0 || sizex.value == "") {
            size_sizesX = [...size_sizesX, sizex.placeholder];
        } else {
            size_sizesX = [...size_sizesX, sizex.value];
        }
    });
    let size_sizesY = [];
    document.getElementsByClassName("size_sizesY").forEach((sizey) => {
        if (sizey.value == null || sizey.value.length == 0 || sizey.value == "") {
            size_sizesY = [...size_sizesY, sizey.placeholder];
        } else {
            size_sizesY = [...size_sizesY, sizey.value];
        }
        size_sizesY = [...size_sizesY, sizey.value];
    });
    let size_sizesZ = [];
    document.getElementsByClassName("size_sizesZ").forEach((sizez) => {
        if (sizez.value == null || sizez.value.length == 0 || sizez.value == "") {
            size_sizesZ = [...size_sizesZ, sizez.placeholder];
        } else {
            size_sizesZ = [...size_sizesZ, sizez.value];
        }
    });
    let size_quantity = [];
    document.getElementsByClassName("size_quantity").forEach((quantity) => {
        if (quantity.value == null || quantity.value.length == 0 || quantity.value == "") {
            size_quantity = [...size_quantity, quantity.placeholder];
        } else {
            size_quantity = [...size_quantity, quantity.value];
        }
    });
    let size_weight = [];
    document.getElementsByClassName("size_weight").forEach((weight) => {
        if (weight.value == null || weight.value.length == 0 || weight.value == "") {
            size_weight = [...size_weight, weight.placeholder];
        } else {
            size_weight = [...size_weight, weight.value];
        }
    });
    let size_price = [];
    document.getElementsByClassName("size_price").forEach((price) => {
        if (price.value == null || price.value.length == 0 || price.value == "") {
            size_price = [...size_price, price.placeholder];
        } else {
            size_price = [...size_price, price.value];
        }
    });
    let size_ip = [];
    document.getElementsByClassName("size_ip").forEach((ip) => {
        if (ip.value == null || ip.value.length == 0 || ip.value == "") {
            size_ip = [...size_ip, ip.placeholder];
        } else {
            size_ip = [...size_ip, ip.value];
        }
    });
    let size_connection = [];
    document.getElementsByClassName("size_connection").forEach((connection) => {
        let save = [];
        connection.innerHTML.getElementsByClassName("size_connection_count").forEach((connection_count) => {
            if (connection_count.value == null || connection_count.value.length == 0 || connection_count.value == "") {
                save = [...save, [connection_count.getAttribute('data-id'), connection_count.placeholder]];
            } else {
                save = [...save, [connection_count.getAttribute('data-id'), connection_count.value]];
            }
        });
        size_connection = [...size_connection, save];
    });

    let size_outer_Box = [];
    document.getElementsByClassName("size_outer_box").forEach((connection) => {
        let save = [];
        connection.innerHTML.getElementsByClassName("outer_box_count").forEach((outer_box_count) => {
            if (outer_box_count.value == null || outer_box_count.value.length == 0 || outer_box_count.value == "") {
                save = [...save, [outer_box_count.getAttribute('data-id'), outer_box_count.placeholder]];
            } else {
                save = [...save, [outer_box_count.getAttribute('data-id'), outer_box_count.value]];
            }
        });
        size_outer_Box = [...size_outer_Box, save];
    });
    if (name != "") {
        var ip = location.host;
        var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
        socket.once('connect', () => {
            socket.emit('item_data', [name, instructions, color, size_count, size_sizesX, size_sizesY, size_sizesZ, size_quantity, size_outer_Box, size_weight, size_price, size_ip, size_connection]);
            socket.once("successi", (data) => {
                for (let e = 0; e < pictures.length; e++) {
                    let r = new FileReader();
                    r.addEventListener("loadend", function () {
                        let picres = r.result;
                        socket.emit('setitempic', [data, name, picres.length, e]);
                        socket.on("pready" + data + "&" + name + "&" + e, (datas) => {
                            socket.emit("pback" + data + "&" + name + "&" + e, [datas, picres.slice(0 + (datas * 9900), 9900 * (datas + 1))]);
                            if (datas + 1 >= picres.size / 9900) {
                                console.log("allsended");
                            }
                        });
                        socket.once("ptransferred" + data + false + "&" + name + "&" + e, (datas) => {
                            if (datas === false) {
                                socket.emit("ptransferred" + data + true + "&" + name + "&" + e, true);
                                socket.removeAllListeners("pready" + data + "&" + name + "&" + e);
                            }
                        });
                    });
                    r.readAsDataURL(pic[e]);
                }
                socket.once("pfin" + data + "&" + name, (dat) => {
                    if (dat >= pictures.length) {
                        document.getElementById("item_picture").reset();
                        location.reload();
                    }
                });
            });
        });
    }
}

function addbox(a) {
    console.log(location);
    var name = document.getElementById("box_name").value;
    document.getElementById("box_name").value = "";
    var outer_box = document.getElementById("outer_box_select").value;
    document.getElementById("outer_box_select").value = 1;
    var weight = parseFloat(document.getElementById("box_weight").value);
    document.getElementById("box_weight").value = "";
    var unit_weight = document.getElementById("unit_box_weight").value;
    document.getElementById("unit_box_weight").value = "g";
    var parent = document.getElementById(a);
    var items = parent.getElementsByClassName("field_item");
    var boxs = parent.getElementsByClassName("field_box");
    var color = document.getElementById("box_color").value;
    document.getElementById("box_color").value = "#FFFFFF";
    var pic = document.getElementById("box_pic").files;
    var location_name = document.getElementById("location_name").value;
    document.getElementById("location_name").value = "";
    var itemlist = [];
    if (name != "") {
        Array.prototype.forEach.call(items, function (values) {
            let value = values.value;
            values.value = 0;
            let id = values.getAttribute("data-id");
            let min = values.getAttribute("data-min");
            let max = values.getAttribute("data-max");
            var b = false;
            if (min != "") {
                if (parseInt(min) <= value) {
                    if (max != "") {
                        if (parseInt(max) >= value) {
                            b = true;
                        }
                    } else {
                        b = true;
                    }
                }
            } else if (max != "") {
                if (parseInt(max) >= value) {
                    b = true;
                }
            } else {
                b = true;
            }
            if (b) {
                itemlist = [...itemlist, id, value];
            }
        });
        var boxlist = [];
        Array.prototype.forEach.call(boxs, function (values) {
            let id = values.getAttribute("data-id");
            if (values.checked) {
                boxlist = [...boxlist, id];
            }
        });
        console.log(location);
        console.log(location.host);
        var ip = location.host;
        console.log(ip);
        var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
        socket.once('connect', () => {
            socket.once('getweight_Unit', (dat) => {
                dat.forEach((values) => {
                    if (unit_weight === values.name) {
                        weight = weight * parseFloat(values.multiplicator);
                    }
                });
                socket.emit('box_data', [name, outer_box, boxlist, itemlist, color, weight, location_name]);
                socket.once("successb", (data) => {
                    for (let e = 0; e < pic.length; e++) {
                        let packag_parts = pic[e].match(/.{1,9900}(\s|$)/g);
                        socket.emit('setboxpic', [data, name, packag_parts.length]);
                        for (let i = 0; i < packag_parts.length; i++) {
                            socket.once("pready" + data + "&" + name, (datas) => {
                                socket.emit("pback" + data + "&" + name, [datas[0], datas[1], packag_parts[datas[1]]]);
                            });
                        }
                    }
                    document.getElementById("box_pic_f").reset();
                });
            });
        })
    }
}

function addinstructions(a) {
    var name = document.getElementById("instructions_name").value;
    document.getElementById("instructions_name").value = "";
    var file = document.getElementById("instruction_file").files;
    var items;
    var parent = document.getElementById(a);
    items = parent.getElementsByClassName("field");

    var itemlist = [];
    if (name != "" && items.length > 0) {
        Array.prototype.forEach.call(items, function (values) {
            let checked = values.checked;
            values.checked = false;
            if (checked) {
                let id = values.getAttribute("data-id");
                itemlist = [...itemlist, id];
            }
        });
        var ip = location.host;
        var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
        socket.once('connect', () => {
            socket.emit('instruction_data', [name, itemlist, file, file.length]);
            socket.once("successinst", (data) => { document.getElementById("instructions_f").reset(); location.reload(); });
        });
    }
}