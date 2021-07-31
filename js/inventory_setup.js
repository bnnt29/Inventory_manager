function opentab(evt, tabName) {
    if (evt.currentTarget.classList.contains("active")) {
        evt.currentTarget.className = evt.currentTarget.className.replace(" active", "");
        document.getElementById(tabName).style.display = "none";
        document.getElementById("edit_box").style.display = "none";
        document.getElementById("edit_pen_box").href = "";
    } else {
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
        document.getElementById("edit_box").style.display = "block";
        document.getElementById("edit_pen_box").href = "http://" + location.host + "/box_group&" + evt.currentTarget.getAttribute("data-id");
    }
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

function init_tab_links() {
    var init_tab_links = false;
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.on('connect', () => {
        socket.on('getboxgroupname', (data) => {
            if (!init_tab_links) {
                let button;
                let b = false;
                data.forEach((values) => {
                    let parent = document.getElementById("tablinks_div");
                    button = document.createElement("button");
                    button.classList.add("tablinks");
                    button.setAttribute("data-id", values.id);
                    button.innerHTML = values.name;
                    button.onclick = () => { opentab(event, values.id); };
                    let def = document.getElementById("default");
                    parent.appendChild(button);
                    b = true;

                    let col_lg_12 = document.getElementById("tabs");
                    let tabc = document.createElement("div");
                    tabc.classList.add("tabcontent");
                    tabc.id = values.id;
                    col_lg_12.appendChild(tabc);
                    init_box_coll(tabc);
                });
                init_tab_links = true;
            }
        })
    });
}

function init_box_coll(tabc) {
    var init_box_coll = false;
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.on('connect', () => {
        socket.emit("sql_read", "SELECT * FROM box WHERE box_group_id ='" + tabc.id + "' ORDER BY name ASC");
        socket.on("sql_r" + "SELECT * FROM box WHERE box_group_id ='" + tabc.id + "' ORDER BY name ASC", (data) => {
            if (!init_box_coll) {
                data.forEach((values) => {
                    let row4 = document.createElement("div");
                    row4.classList.add("row");
                    let col_lg_11 = document.createElement("div");
                    col_lg_11.classList.add("col-lg-11");
                    row4.appendChild(col_lg_11);
                    let p = document.createElement("p");
                    p.classList.add("collapsible");
                    p.innerHTML = values.name;
                    col_lg_11.appendChild(p);
                    if (values.color != null) {
                        p.style.backgroundColor = values.color;
                    } else {
                        p.style.backgroundColor = "#FFFFFF";
                    }
                    tabc.appendChild(row4);
                    let col_lg_1 = document.createElement("div");
                    col_lg_1.classList.add("col-lg-1");
                    col_lg_1.style.transform = "translateY(25%)";
                    let a = document.createElement("a");
                    a.href = "http://" + location.host + "/box&" + values.id;
                    col_lg_1.appendChild(a);
                    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    let img = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
                    svg.setAttributeNS(null, 'viewBox', "0 0 528.899 528.899");
                    img.setAttributeNS(null, "d", "M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981   c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611   C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069   L27.473,390.597L0.3,512.69z"); //Set path's data
                    a.appendChild(svg);
                    svg.style.width = "2rem";
                    svg.style.height = "2rem";
                    svg.appendChild(img);
                    row4.appendChild(col_lg_1);
                    let content = document.createElement("div");
                    content.classList.add("content");
                    content.id = values.name;
                    content.setAttribute("data-id", values.id);
                    content.style.display = "none";
                    tabc.append(content);
                    init_item_row(content, values);
                    init_collapse(row4);
                });
                init_box_coll = true;
            }
        })
    });
}

function init_item_row(content, vals) {
    var init_item_row = false;
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.on('connect', () => {
        socket.emit("sql_read", "SELECT * FROM item_box ib LEFT JOIN item i ON ib.item_id = i.id WHERE ib.box_id='" + parseInt(content.getAttribute("data-id")) + "' ORDER BY i.name ASC");
        socket.on("sql_r" + "SELECT * FROM item_box ib LEFT JOIN item i ON ib.item_id = i.id WHERE ib.box_id='" + parseInt(content.getAttribute("data-id")) + "' ORDER BY i.name ASC", (data) => {
            if (!init_item_row) {
                data.forEach((values) => {
                    let row = document.createElement("div");
                    row.classList.add("row");
                    row.classList.add("item");
                    content.appendChild(row);
                    let col_lg_12 = document.createElement("div");
                    col_lg_12.classList.add("col-lg-12");
                    col_lg_12.id = vals.name + "_" + values.name;
                    row.appendChild(col_lg_12);
                    let a = document.createElement("a");
                    a.id = "link" + vals.name + "_" + values.name;
                    a.href = "http://" + location.host + "/item&" + values.id;
                    a.style.color = "black";
                    a.style.textDecoration = "none";
                    col_lg_12.appendChild(a);
                    row = document.createElement("div");
                    row.classList.add("row");
                    row.style.marginTop = "1rem";
                    a.appendChild(row);
                    let col_lg_6 = document.createElement("div");
                    col_lg_6.classList.add("col-lg-6");
                    row.appendChild(col_lg_6);
                    let p = document.createElement("p");
                    p.innerHTML = values.name;
                    col_lg_6.appendChild(p);
                    col_lg_6 = document.createElement("div");
                    col_lg_6.classList.add("col-lg-6");
                    row.appendChild(col_lg_6);
                    p = document.createElement("p");
                    p.innerHTML = values.quantity;
                    col_lg_6.appendChild(p);
                });
                init_item_row = true;
            }
        })
    });
}