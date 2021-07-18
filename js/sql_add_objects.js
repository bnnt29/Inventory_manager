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
function init_collapse() {
    let coll = document.getElementsByClassName("collapsible");

    for (let i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            let content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
}

function getinstructions() {
    var instructions_get = false;
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.on('connect', () => {
        socket.on('getinstructions', (data) => {
            if (!instructions_get) {
                data.forEach(function (values) {
                    let parent = document.getElementById("instructions_select");
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
    socket.on('connect', () => {
        socket.on('getboxgroup', (data) => {
            if (!box_get) {
                data.forEach(function (values) {
                    let parent = document.getElementById("box_group_select");
                    let option = document.createElement("option");
                    parent.appendChild(option);
                    option.value = values.id;
                    option.innerHTML = values.name;
                });
                box_get = true;
            }
        })
    });
}

function getitem_node(a, b) {
    let item_getnode = false;
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.on('connect', () => {
        if (a == b) {
            socket.emit("in_use_box_node", b);
        }
        socket.on("" + b, (data) => {
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

                    if (a != "box_container1") {
                        input = document.createElement("input");
                        input.classList.add("input-group-field");
                        input.classList.add("field");
                        input.type = "number";
                        input.name = values.name;
                        input.value = "0";
                        input.placeholder = "0";
                        input.title = "value";
                        if (a == "item_container1") {
                            var max = values.total_quantity;
                            socket.emit("sql_read", "SELECT * FROM item_box WHERE item_id='" + values.id + "'");
                            socket.on("SELECT * FROM item_box WHERE item_id='" + values.id + "'", (data) => { data.forEach((dat) => { max -= parseInt(dat.quantity); }); });
                            input.setAttribute("data-max", max);
                            input.setAttribute("data-min", "");
                            input.addEventListener('change', () => { if (parseInt(input.value) > max) { input.value = max;/* console.log("Not enough items left");*/ } });
                        }
                        input.setAttribute("data-id", values.id);
                        input.style.width = "16rem";
                        input.style.height = "3rem";
                        input.style.alignSelf = "center";
                        col_lg_6.appendChild(input);
                    } else {
                        input = document.createElement("input");
                        input.classList.add("field");
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
    socket.on('connect', () => {
        socket.on(b, (data) => {
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
    var unit_get = false;
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.on('connect', () => {
        socket.on('getUnit', (data) => {
            if (!unit_get) {
                data.forEach(function (values) {
                    let parent = document.getElementById("unit");
                    let option = document.createElement("option");
                    parent.appendChild(option);
                    option.value = values.name;
                    option.innerHTML = values.name;
                });
                unit_get = true;
            }
        })
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

function additem() {
    var name = document.getElementById("item_name").value;
    document.getElementById("item_name").value = "";
    var instructions = parseInt(document.getElementById("instructions_select").value);
    document.getElementById("instructions_select").value = "Choose";
    var size = parseFloat(document.getElementById("item_size").value);
    document.getElementById("item_size").value = "";
    var unit = document.getElementById("unit").value;
    document.getElementById("unit").value = "mm";
    var quantity = parseFloat(document.getElementById("item_quantity").value);
    document.getElementById("item_quantity").value = "";
    if (name != "") {
        var ip = location.host;
        var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
        socket.on('connect', () => {
            socket.on('getUnit', (data) => {
                data.forEach(function (values) {
                    if (unit === values.name) {
                        size = size * parseFloat(values.multiplicator);
                        socket.emit('item_data', [name, instructions, size, quantity]);
                        location.reload();
                    }
                });
            })
        });
    }
}

function addbox(a) {
    var name = document.getElementById("box_name").value;
    document.getElementById("box_name").value = "";
    var box_group = parseInt(document.getElementById("box_group_select").value);
    document.getElementById("box_group_select").value = "Choose";
    var items;
    var parent = document.getElementById(a);
    items = parent.getElementsByClassName("field");
    var itemlist = [];
    if (name != "" && items.length > 0) {
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
        var ip = location.host;
        var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
        socket.on('connect', () => {
            socket.emit('box_data', [name, box_group, itemlist]);
            location.reload();
        });
    }
}

function addboxgroup(a) {
    var name = document.getElementById("box_group_name").value;
    document.getElementById("box_group_name").value = "";
    var location_n = document.getElementById("location_name").value;
    document.getElementById("location_name").value = "";

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
        console.log(name + "," + location_n + "," + itemlist);
        var ip = location.host;
        var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
        socket.on('connect', () => {
            socket.emit('box_group_data', [name, location_n, itemlist]);
            location.reload();
        });
    }
}