var accordion_count = 0;

function init() {
    addsize();
    getinstructions();
    getbox();
    getitem();
    getinnerbox();
    getconnection();
    getitembox();
}

function addsize() {
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.once('connect', () => {
        socket.once('getouter_box', (box) => {
            socket.once('getconnection', (connection) => {
                let outer_accordion = document.getElementById("size-x-0");
                outer_accordion = outer_accordion.cloneNode(true);
                outer_accordion.id = "size-" + accordion_count + "-0";
                outer_accordion.classList.add("item_size_count");
                let elements = outer_accordion.getElementsByClassName("item_selecter");

                elements[0].id = "size-" + accordion_count + "-" + 0 + "-" + 0;
                elements[0].dataset.bsTarget = "#size-" + accordion_count + "-" + 0 + " .item-1";
                elements[0].setAttribute("aria-controls", "size-" + accordion_count + "-" + 0 + " .item-1");
                elements[1].id = "size-" + accordion_count + "-" + 0 + "-" + 1;
                elements[1].setAttribute("data-bs-parent", "#size-" + accordion_count + "-" + 0);
                elements[1].classList.add("item-1");

                elements[2].id = "size-" + accordion_count + "-" + 1;
                elements[3].id = "size-" + accordion_count + "-" + 1 + "-" + 0;
                elements[3].dataset.bsTarget = "#size-" + accordion_count + "-" + 1 + " .item-2";
                elements[3].setAttribute("aria-controls", "size-" + accordion_count + "-" + 1 + " .item-2");
                elements[4].id = "size-" + accordion_count + "-" + 1 + "-" + 1;
                elements[4].setAttribute("data-bs-parent", "#size-" + accordion_count + "-" + 1);
                elements[4].classList.add("item-2");

                elements[5].id = "size-" + accordion_count + "-" + 2;
                elements[6].id = "size-" + accordion_count + "-" + 2 + "-" + 0;
                elements[6].dataset.bsTarget = "#size-" + accordion_count + "-" + 2 + " .item-3";
                elements[6].setAttribute("aria-controls", "size-" + accordion_count + "-" + 2 + " .item-3");
                elements[7].id = "size-" + accordion_count + "-" + 2 + "-" + 1;
                elements[7].setAttribute("data-bs-parent", "#size-" + accordion_count + "-" + 2);
                elements[7].classList.add("item-3");

                outer_accordion.getElementsByClassName("size_sizes")[0].id = "size_sizes-" + accordion_count + "-X";
                outer_accordion.getElementsByClassName("size_sizes")[1].id = "size_sizes-" + accordion_count + "-Y";
                outer_accordion.getElementsByClassName("size_sizes")[2].id = "size_sizes-" + accordion_count + "-Z";

                let box_container = outer_accordion.getElementsByClassName("size_outer_box")[0];
                if (box.length > 0) {
                    box.forEach((d) => {
                        let row = box_container.firstElementChild.cloneNode(true);
                        row.getElementsByClassName("box_name")[0].innerHTML = d.name;
                        row.getElementsByClassName("outer_box_count")[0].dataset.id = d.id;
                        row.style.display = "";
                        if (d.name === "default") {
                            row.getElementsByClassName("outer_box_count")[0].placeholder = 1;
                            row.getElementsByClassName("outer_box_count")[0].id = "size_default_outer_box-" + accordion_count;
                        }
                        box_container.appendChild(row);
                    });
                } else {
                    let p = document.createElement("p");
                    p.innerHTML = "No box found";
                    box_container.appendChild(p);
                }

                let connection_container = outer_accordion.getElementsByClassName("size_connection")[0];
                if (connection.length > 0) {
                    connection.forEach((d) => {
                        let row = connection_container.firstElementChild.cloneNode(true);
                        row.getElementsByClassName("connection_name")[0].innerHTML = d.name;
                        row.getElementsByClassName("size_connection_count")[0].dataset.id = d.id;
                        row.style.display = "";
                        box_container.appendChild(row);
                    });
                } else {
                    let p = document.createElement("p");
                    p.innerHTML = "No connection found";
                    connection_container.appendChild(p);
                }

                outer_accordion.getElementsByClassName("size_quantity")[0].setAttribute("size_count", accordion_count);
                outer_accordion.getElementsByClassName("size_quantity")[0].oninput = size_default_quantity;

                outer_accordion.style.display = "";
                document.getElementById("item_size_body-1").appendChild(outer_accordion);
                document.getElementById("size-" + accordion_count + "-0-0").innerHTML = "0 : 0 : 0";

                document.getElementById("size_sizes-" + accordion_count + "-X").oninput = build_name;
                document.getElementById("size_sizes-" + accordion_count + "-Y").oninput = build_name;
                document.getElementById("size_sizes-" + accordion_count + "-Z").oninput = build_name;
            });
        });
    });
    accordion_count += 1;
}

function size_default_quantity(element) {
    document.getElementById("size_default_outer_box-" + element.target.getAttribute("size_count")).value = element.target.value;
}

function build_name(element) {
    let size_count = parseInt(element.target.id.substring(element.target.id.toString().indexOf("s-") + 2, element.target.id.toString().lastIndexOf("-")));
    let x = document.getElementById("size_sizes-" + size_count + "-X");
    let y = document.getElementById("size_sizes-" + size_count + "-Y");
    let z = document.getElementById("size_sizes-" + size_count + "-Z");
    let s = (x.value.length <= 0 ? x.placeholder : x.value);
    s += " : ";
    s += (y.value.length <= 0 ? y.placeholder : y.value);
    s += " : ";
    s += (z.value.length <= 0 ? z.placeholder : z.value);
    document.getElementById("size-" + size_count + "-0-0").innerHTML = s;
}

function getinstructions() {
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.once('connect', () => {
        socket.once('getinstructions', (instruction) => {
            instruction.forEach(function (values) {
                let parent = document.getElementById("item_instruction");
                let option = document.createElement("option");
                parent.appendChild(option);
                option.value = values.id;
                option.innerHTML = values.name;
            });
            instruction.forEach(function (values) {
                let parent = document.getElementById("box_instruction");
                let option = document.createElement("option");
                parent.appendChild(option);
                option.value = values.id;
                option.innerHTML = values.name;
            });
        })
    });
}

function getbox() {
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.once('connect', () => {
        socket.once('getouter_box', (box) => {
            box.forEach((values) => {
                let parent = document.getElementById("box_outer_box");
                let option = document.createElement("option");
                parent.appendChild(option);
                option.value = values.id;
                option.innerHTML = values.name;
            });
            let box_container = document.getElementById("instruction_box_body");
            if (box.length > 0) {
                box.forEach((d) => {
                    let row = box_container.firstElementChild.cloneNode(true);
                    row.getElementsByClassName("instruction_box_name")[0].innerHTML = d.name;
                    row.getElementsByClassName("instruction_box_checkbox")[0].dataset.id = d.id;
                    row.style.display = "";
                    box_container.appendChild(row);
                });
            } else {
                let p = document.createElement("p");
                p.innerHTML = "No item found";
                box_container.appendChild(p);
            }
        })
    });
}

function resetrangeinput(e) {
    e.target.value = 0;
    e.target.nextSibling.nextSibling.innerHTML = e.target.value;
}

function rangeupdatehandle(e) {
    e.target.nextSibling.nextSibling.innerHTML = e.target.value;
}

function getitem() {
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.once('connect', () => {
        socket.once('unused_getitem', (item) => {
            // console.log(item);
            let item_container = document.getElementById("box_item_body");
            if (item.length > 0) {
                item.forEach((d) => {
                    // console.log(d);
                    let row = item_container.firstElementChild.cloneNode(true);
                    row.getElementsByClassName("box_item_name")[0].innerHTML = d.name;
                    let range = row.getElementsByClassName("box_outer_item_count")[0];
                    range.dataset.id = d.id;
                    range.addEventListener('dblclick', function (e) { resetrangeinput(e) });
                    range.addEventListener("input", function (e) { rangeupdatehandle(e); });
                    range.addEventListener("change", function (e) { rangeupdatehandle(e); });
                    range.max = d.quantity;
                    range.min = 0;
                    range.value = 0;
                    row.style.display = "";
                    item_container.appendChild(row);
                });
            } else {
                let p = document.createElement("p");
                p.innerHTML = "No item found";
                item_container.appendChild(p);
            }
        });
        socket.once('getitem', (item) => {
            let item_container = document.getElementById("instruction_item_body");
            if (item.length > 0) {
                item.forEach((d) => {
                    let row = item_container.firstElementChild.cloneNode(true);
                    row.getElementsByClassName("instruction_item_name")[0].innerHTML = d.name;
                    row.getElementsByClassName("instruction_item_checkbox")[0].dataset.id = d.id;
                    row.style.display = "";
                    item_container.appendChild(row);
                });
            } else {
                let p = document.createElement("p");
                p.innerHTML = "No item found";
                item_container.appendChild(p);
            }
        });
    });
}

function getinnerbox() {
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.once('connect', () => {
        socket.once('getinnerbox', (box) => {
            let box_container = document.getElementById("box_inner_body");
            if (box.length > 0) {
                box.forEach((d) => {
                    let row = box_container.firstElementChild.cloneNode(true);
                    row.getElementsByClassName("box_inner_box_name")[0].innerHTML = d.name;
                    row.getElementsByClassName("box_inner_box_checkbox")[0].dataset.id = d.id;
                    row.style.display = "";
                    box_container.appendChild(row);
                });
            } else {
                let p = document.createElement("p");
                p.innerHTML = "No item found";
                box_container.appendChild(p);
            }
        });
    });
}


function getconnection() {
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.once('connect', () => {
        socket.once('getconnection', (connection) => {
            let connection_container = document.getElementById("instruction_connection_body");
            if (connection.length > 0) {
                connection.forEach((d) => {
                    let row = connection_container.firstElementChild.cloneNode(true);
                    row.getElementsByClassName("Instruction_connection_name")[0].innerHTML = d.name;
                    row.getElementsByClassName("instruction_connection_checkbox")[0].dataset.id = d.id;
                    row.style.display = "";
                    connection_container.appendChild(row);
                });
            } else {
                let p = document.createElement("p");
                p.innerHTML = "No item found";
                connection_container.appendChild(p);
            }
        });
    });
}

function getitembox() {
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.once('connect', () => {
        socket.once('unused_getitem', (dat) => {
            dat.forEach((item) => {
                console.log(item);
                // console.log(data);
                let outer_accordion = document.getElementById("in_use-x-0");
                outer_accordion = outer_accordion.cloneNode(true);
                outer_accordion.id = "size-" + accordion_count + "-0";
                let elements = outer_accordion.getElementsByClassName("in_use_selecter");

                elements[0].id = "size-" + accordion_count + "-" + 0 + "-" + 0;
                elements[0].dataset.bsTarget = "#size-" + accordion_count + "-" + 0 + " .item-1";
                elements[0].setAttribute("aria-controls", "size-" + accordion_count + "-" + 0 + " .item-1");
                elements[1].id = "size-" + accordion_count + "-" + 0 + "-" + 1;
                elements[1].setAttribute("data-bs-parent", "#size-" + accordion_count + "-" + 0);
                elements[1].classList.add("item-1");

                elements[2].id = "size-" + accordion_count + "-" + 1;
                elements[3].id = "size-" + accordion_count + "-" + 1 + "-" + 0;
                elements[3].dataset.bsTarget = "#size-" + accordion_count + "-" + 1 + " .item-2";
                elements[3].setAttribute("aria-controls", "size-" + accordion_count + "-" + 1 + " .item-2");
                elements[4].id = "size-" + accordion_count + "-" + 1 + "-" + 1;
                elements[4].setAttribute("data-bs-parent", "#size-" + accordion_count + "-" + 1);
                elements[4].classList.add("item-2");

                outer_accordion.getElementsByClassName("in_use_item_name")[0].innerHTML = item.name;
                outer_accordion.getElementsByClassName("in_use_item_size")[0].innerHTML = item.sizeX + " : " + item.sizeY + " : " + item.sizeZ;
                // outer_accordion.getElementsByClassName("in_use_box_name")[0].innerHTML = item.box.name;
                outer_accordion.style.display = "";
                console.log(outer_accordion);
                document.getElementById("in_use_items_body-1").appendChild(outer_accordion);
            });
        });
    });
    accordion_count += 1;
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
    let color = document.getElementById("item_color").value;
    document.getElementById("item_color").value = "#FFFFFF";
    let pictures = document.getElementById("item_picture").files;

    let size_count = document.getElementsByClassName("item_size_count").length;
    let size_sizesX = [];
    Array.prototype.forEach.call(document.getElementsByClassName("size_sizesX"), (sizex) => {
        if (sizex.value == null || sizex.value.length == 0 || sizex.value == "") {
            size_sizesX = [...size_sizesX, sizex.placeholder];
        } else {
            size_sizesX = [...size_sizesX, sizex.value];
        }
    });
    size_sizesX = size_sizesX.slice(1);
    let size_sizesY = [];
    Array.prototype.forEach.call(document.getElementsByClassName("size_sizesY"), (sizey) => {
        if (sizey.value == null || sizey.value.length == 0 || sizey.value == "") {
            size_sizesY = [...size_sizesY, sizey.placeholder];
        } else {
            size_sizesY = [...size_sizesY, sizey.value];
        }
    });
    size_sizesY = size_sizesY.slice(1);
    let size_sizesZ = [];
    Array.prototype.forEach.call(document.getElementsByClassName("size_sizesZ"), (sizez) => {
        if (sizez.value == null || sizez.value.length == 0 || sizez.value == "") {
            size_sizesZ = [...size_sizesZ, sizez.placeholder];
        } else {
            size_sizesZ = [...size_sizesZ, sizez.value];
        }
    });
    size_sizesZ = size_sizesZ.slice(1);
    let size_quantity = [];
    Array.prototype.forEach.call(document.getElementsByClassName("size_quantity"), (quantity) => {
        if (quantity.value == null || quantity.value.length == 0 || quantity.value == "") {
            size_quantity = [...size_quantity, quantity.placeholder];
        } else {
            size_quantity = [...size_quantity, quantity.value];
        }
    });
    size_quantity = size_quantity.slice(1);
    let size_weight = [];
    Array.prototype.forEach.call(document.getElementsByClassName("size_weight"), (weight) => {
        if (weight.value == null || weight.value.length == 0 || weight.value == "") {
            size_weight = [...size_weight, weight.placeholder];
        } else {
            size_weight = [...size_weight, weight.value];
        }
    });
    size_weight = size_weight.slice(1);
    let size_price = [];
    Array.prototype.forEach.call(document.getElementsByClassName("size_price"), (price) => {
        if (price.value == null || price.value.length == 0 || price.value == "") {
            size_price = [...size_price, price.placeholder];
        } else {
            size_price = [...size_price, price.value];
        }
    });
    size_price = size_price.slice(1);
    let size_ip = [];
    Array.prototype.forEach.call(document.getElementsByClassName("size_ip"), (ip) => {
        if (ip.value == null || ip.value.length == 0 || ip.value == "") {
            size_ip = [...size_ip, ip.placeholder];
        } else {
            size_ip = [...size_ip, ip.value];
        }
    });
    size_ip = size_ip.slice(1);
    let size_connection = [];
    Array.prototype.forEach.call(document.getElementsByClassName("size_connection"), (connection) => {
        let save = [];
        Array.prototype.forEach.call(connection.getElementsByClassName("size_connection_count"), (connection_count) => {
            if (connection_count.value == null || connection_count.value.length == 0 || connection_count.value == "") {
                save = [...save, [parseInt(connection_count.getAttribute('data-id')), parseInt(connection_count.placeholder)]];
            } else {
                save = [...save, [parseInt(connection_count.getAttribute('data-id')), parseInt(connection_count.value)]];
            }
        });
        save = save.slice(1);
        size_connection = [...size_connection, save];
    });
    size_connection = size_connection.slice(1);
    let size_outer_Box = [];
    Array.prototype.forEach.call(document.getElementsByClassName("size_outer_box"), (connection) => {
        let save = [];
        Array.prototype.forEach.call(connection.getElementsByClassName("outer_box_count"), (outer_box_count) => {
            if (outer_box_count.value == null || outer_box_count.value.length == 0 || outer_box_count.value == "") {
                save = [...save, [parseInt(outer_box_count.getAttribute('data-id')), parseInt(outer_box_count.placeholder)]];
            } else {
                save = [...save, [parseInt(outer_box_count.getAttribute('data-id')), parseInt(outer_box_count.value)]];
            }
        });
        save = save.slice(1);
        size_outer_Box = [...size_outer_Box, save];
    });
    size_outer_Box = size_outer_Box.slice(1);
    console.log(size_outer_Box);
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

function addbox() {
    let name = document.getElementById("box_name").value;
    document.getElementById("box_name").value = "";
    let outer_box = parseInt(document.getElementById("box_outer_box").value);
    let color = document.getElementById("box_color").value;
    document.getElementById("box_color").value = "#FFFFFF";
    let weight = document.getElementById("box_weight").value;
    document.getElementById("box_weight").value = 0;
    let instructions = parseInt(document.getElementById("box_instruction").value);
    let location = document.getElementById("box_location").value;
    let pictures = document.getElementById("box_picture").files;
    let Items = [];
    Array.prototype.forEach.call(document.getElementsByClassName("range-slider__range"), (count) => {
        if (count.value == null || count.value.length == 0 || count.value == "") {
            Items = [...Items, [parseInt(count.getAttribute('data-id')), parseInt(count.placeholder)]];
        } else {
            Items = [...Items, [parseInt(count.getAttribute('data-id')), parseInt(count.value)]];
        }
    });
    let inner_box = [];
    Array.prototype.forEach.call(document.getElementsByClassName("box_inner_box_checkbox"), (check) => {
        inner_box = [...inner_box, [parseInt(check.getAttribute('data-id')), check.checked]];
    });
    if (name != "") {
        var ip = location.host;
        var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
        socket.once('connect', () => {
            socket.emit('box_data', [name, outer_box, color, weight, instructions, location, Items, inner_box]);
            socket.once("successi", (data) => {
                for (let e = 0; e < pictures.length; e++) {
                    let r = new FileReader();
                    r.addEventListener("loadend", function () {
                        let picres = r.result;
                        socket.emit('setboxpic', [data, name, picres.length, e]);
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

function addinstruction() {
    let name = document.getElementById("instruction_name").value;
    document.getElementById("instruction_name").value = "";
    let pdf = document.getElementById("instruction_pdf").files[0];
    let Items = [];
    Array.prototype.forEach.call(document.getElementsByClassName("instruction_item_checkbox"), (check) => {
        Items = [...Items, [parseInt(check.getAttribute('data-id')), check.checked]];
    });
    let box = [];
    Array.prototype.forEach.call(document.getElementsByClassName("instruction_box_checkbox"), (check) => {
        box = [...box, [parseInt(check.getAttribute('data-id')), check.checked]];
    });
    let connection = [];
    Array.prototype.forEach.call(document.getElementsByClassName("instruction_connection_checkbox"), (check) => {
        connection = [...connection, [parseInt(check.getAttribute('data-id')), check.checked]];
    });
    let text = document.getElementById("instruction_text").value;
    document.getElementById("instruction_text").value = null;
    if (name != "") {
        var ip = location.host;
        var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
        socket.once('connect', () => {
            socket.emit('instruction_data', [name, Items, box, connection, text]);
            socket.once("successi", (data) => {
                let r = new FileReader();
                r.addEventListener("loadend", function () {
                    let picres = r.result;
                    socket.emit('setinstpdf', [data, name, picres.length, e]);
                    socket.on("pdready" + data + "&" + name + "&" + e, (datas) => {
                        socket.emit("pdback" + data + "&" + name + "&" + e, [datas, picres.slice(0 + (datas * 9900), 9900 * (datas + 1))]);
                        if (datas + 1 >= picres.size / 9900) {
                            console.log("allsended");
                        }
                    });
                    socket.once("pdtransferred" + data + false + "&" + name + "&" + e, (datas) => {
                        if (datas === false) {
                            socket.emit("pdtransferred" + data + true + "&" + name + "&" + e, true);
                            socket.removeAllListeners("pdready" + data + "&" + name + "&" + e);
                        }
                    });
                });
                r.readAsDataURL(pic[e]);
                socket.once("pdfin" + data + "&" + name, (dat) => {
                    if (dat >= pictures.length) {
                        document.getElementById("item_picture").reset();
                        location.reload();
                    }
                });
            });
        });
    }
}
