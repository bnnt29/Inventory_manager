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
    console.log(tabName + ", " + document.getElementById(tabName).style.display);
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
        socket.on("SELECT * FROM box WHERE box_group_id ='" + tabc.id + "' ORDER BY name ASC", (data) => {
            if (!init_box_coll) {
                data.forEach((values) => {
                    let but = document.createElement("button");
                    but.type = "button";
                    but.classList.add("collapsible");
                    but.innerHTML = values.name;
                    tabc.appendChild(but);
                    let content = document.createElement("div");
                    content.classList.add("content");
                    content.id = values.name;
                    content.setAttribute("data-id", values.id);
                    content.style.display = "none";
                    tabc.append(content);
                    init_item_row(content);
                    init_collapse(but);
                });
                init_box_coll = true;
            }
        })
    });
}

function init_item_row(content) {
    var init_item_row = false;
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.on('connect', () => {
        socket.emit("sql_read", "SELECT * FROM item_box ib LEFT JOIN item i ON ib.item_id = i.id WHERE ib.box_id='" + parseInt(content.getAttribute("data-id")) + "' ORDER BY i.name ASC");
        socket.on("SELECT * FROM item_box ib LEFT JOIN item i ON ib.item_id = i.id WHERE ib.box_id='" + parseInt(content.getAttribute("data-id")) + "' ORDER BY i.name ASC", (data) => {
            if (!init_item_row) {
                data.forEach((values) => {
                    let row = document.createElement("div");
                    row.classList.add("row");
                    content.appendChild(row);
                    let col_lg_12 = document.createElement("div");
                    col_lg_12.classList.add("col-lg-12");
                    col_lg_12.id = values.name;
                    row.appendChild(col_lg_12);
                    let a = document.createElement("a");
                    a.id = values.name;
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