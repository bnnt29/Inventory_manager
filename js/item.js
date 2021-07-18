function init() {
    let url = document.URL;
    if (url.indexOf("&") != -1) {
        if (!isNaN(url.substring(url.indexOf("&") + 1, url.length))) {
            ids = url.substring(url.indexOf("&") + 1, url.length);
            id = parseInt(ids);
            if (id >= 1) {
                var ip = location.host;
                var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
                socket.on('connect', () => {
                    socket.emit('getItem_data', id);
                    socket.on('getUnit', (dat) => {
                        socket.on(id, (data) => {
                            data.forEach((values) => {
                                console.log(values);
                                document.getElementById("item_id").innerHTML = id;
                                document.getElementById("item_name").innerHTML = values.item_name;
                                document.getElementById("total_quantity").innerHTML = values.total_quantity;
                                let i = values.size;
                                let shortest = [];
                                let units = [];
                                dat.forEach((val) => {
                                    shortest = [...shortest, "" + i * parseFloat(val.multiplicator)];
                                    units = [...units, val];
                                });
                                let unit = 0;
                                for (let i = 0; i < shortest.length; i++) {
                                    if (shortest[unit].length > shortest[i].length) {
                                        unit = i;
                                    }
                                }
                                document.getElementById("item_size").innerHTML = (dat[unit].multiplicator * i);
                                document.getElementById("item_unit").innerHTML = dat[unit].name;
                                if (values.picture != null) {
                                    document.getElementById("item_img").src = values.picture;
                                }
                                if (values.color != null) {
                                    document.getElementById("color_row").style.backgroundColor = values.color;
                                }
                            });
                            init_tab_links(data);
                        });
                    });
                });
            }
        }
    } else {
        nofile();
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
    data.forEach((values) => {
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
        let tabc = document.createElement("div");
        tabc.classList.add("tabcontent");
        tabc.id = values.box_group_id;
        col_lg_12.appendChild(tabc);
        init_box_coll(tabc, values);
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
    let id = parseInt(document.URL.substring(document.URL.indexOf("&") + 1, document.URL.length));

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
    if (values.color != null) {
        row.style.backgroundColor = values.color;
    } else {
        row.style.backgroundColor = "#FFFFFF";
    }
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
