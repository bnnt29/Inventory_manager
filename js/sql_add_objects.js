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
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
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
        socket.on('getbox', (data) => {
            if (!box_get) {
                data.forEach(function (values) {
                    let parent = document.getElementById("box_group");
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

function getitem_node(a, b, c) {
    var item_getnode = false;
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.on('connect', () => {
        socket.on(b, (data) => {
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

                    input = document.createElement("input");
                    input.classList.add("input-group-field");
                    input.classList.add("field");
                    input.type = "number";
                    input.name = values.name;
                    input.value = "0";
                    input.placeholder = "0";
                    input.title = "value";
                    input.setAttribute("data-max", "");
                    input.setAttribute("data-min", "");
                    input.setAttribute("data-id", values.id);
                    input.style.width = "16rem";
                    input.style.height = "3rem";
                    input.style.alignSelf = "center";
                    col_lg_6.appendChild(input);

                });
                item_getnode = true;
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
    console.log("1");
    if (name != "") { }
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.on('connect', () => {
        socket.on('getUnit', (data) => {
            console.log(data);
            data.forEach(function (values) {
                console.log("3 " + unit + " === " + values.name);
                if (unit === values.name) {
                    size = size * parseFloat(values.multiplicator);
                    console.log("4 " + size + ", " + values.name);
                    socket.emit('item_data', [name, instructions, size]);
                    location.reload();
                }
            });
        })
    });
}
