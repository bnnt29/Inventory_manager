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
            dat = "SELECT * FROM Box WHERE name='" + dat + "'";
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
var l = 0;
function init_f(id) {
    l += 1;
    if (id >= 1) {
        var ip = location.host;
        var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
        socket.on('connect', () => {
            socket.emit('getBox_data', id);
            socket.on("box" + id, (data) => {
                if (data.length != 0) {
                    data.forEach((values) => {
                        console.log(values);
                        document.getElementById("box_id").innerHTML = values.b_id;
                        document.getElementById("box_name").innerHTML = values.b_name;
                        document.getElementById("box_img").alt = values.b_name;
                        socket.emit('getBoxgroup_data', values.bg_id);
                        socket.on("box_group" + values.bg_id, (datas) => {
                            datas.some((values) => {
                                document.getElementById("box_bg").innerHTML = values.bg_name;
                                return true;
                            });
                        });
                        document.getElementById("box_bg").alt = values.b_name;
                        if (values.b_picture != null) {
                            document.getElementById("box_img").src = values.b_picture;
                            document.getElementById("box_picture").innerHTML = values.b_picture;
                        } else {
                            document.getElementById("box_picture").innerHTML = "undefined";
                        }
                        if (values.b_color != null) {
                            document.getElementById("color_row").style.backgroundColor = values.b_color;
                            document.getElementById("box_color").innerHTML = values.b_color;
                            if (values.b_color === "#ffffff") {
                                document.getElementById("box_color").style.color = "#000000";
                            } else {
                                document.getElementById("box_color").style.color = values.b_color;
                            }
                        } else {
                            document.getElementById("box_color").innerHTML = "#000000";
                        }
                    });
                    init_tab_links(data);
                } else {
                    document.getElementById("body").style.display = "none";
                    document.getElementById("html").innerHTML = "The item with the id: " + id + " doesn't exist";
                }
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
    var img = document.getElementById("box_img");
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

function change_box_name(a) {
    if (a === 'true') {
        var name = document.getElementById("box_name_edit").value;
        document.getElementById("box_name").value = name;
        document.getElementById("box_name_edit").value = name;
        if (name != "") {
            var ip = location.host;
            var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
            socket.on('connect', () => {
                socket.emit("sql_read", "SELECT * FROM box WHERE name='" + name + "'");
                socket.on("sql_r" + "SELECT * FROM box WHERE name='" + name + "'", (data) => {
                    if (data.length <= 0) {
                        let dat = [];
                        dat = ["UPDATE box SET name ='" + name + "' WHERE id = '" + id + "'", dat];
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
        input.id = "box_name_edit"
        input.style.width = "16rem";
        input.style.height = "3rem";
        input.title = "box name";
        input.placeholder = "name";
        document.getElementById("box_name").style.display = "none";
        document.getElementById("box_name").parentElement.appendChild(input);
    }
}


function change_box_bg(a) {
    if (a === 'true') {
        var bg = document.getElementById("bg").value;
        document.getElementById("bg").value = bg;
        if (bg != "") {
            var ip = location.host;
            var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
            socket.on('connect', () => {
                socket.on('getboxgroup', (data) => {
                    data.forEach((values) => {
                        if (bg === values.name) {
                            let dat = [];
                            dat = ["UPDATE box SET box_group_id ='" + values.id + "' WHERE id = '" + id + "'", dat];
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
        document.getElementById("edit_pen_bg").disabled = true;
        document.getElementById("edit_pen_bg").style.display = "none";
        document.getElementById("edit_save_bg").style.display = "block";
        document.getElementById("edit_save_bg").disabled = false;
        var ip = location.host;
        var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
        socket.on('connect', () => {
            socket.on('getboxgroup', (data) => {
                let form = document.createElement("form");
                form.id = "box_bg_edit";
                let label = document.createElement("label");
                label.htmlFor = "bg";
                form.appendChild(label);
                let select = document.createElement("select");
                select.id = "bg";
                select.name = "bg";
                select.style.width = "5rem";
                select.style.height = "3rem";
                select.value = document.getElementById(box_bg).innerHTML;
                label.appendChild(select);
                data.forEach((values) => {
                    let option = document.createElement("option");
                    select.appendChild(option);
                    option.value = values.name;
                    option.innerHTML = values.name;
                });
                document.getElementById("box_bg").style.display = "none";
                document.getElementById("box_bg").parentElement.appendChild(form);
            });
        });
    }
}

function change_box_color(a) {
    if (a === 'true') {
        var color = document.getElementById("box_color_edit").value;
        document.getElementById("box_color_edit").value = color;
        if (color != "") {
            var ip = location.host;
            var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
            socket.on('connect', () => {
                let dat = [];
                dat = ["UPDATE box SET color ='" + color + "' WHERE id = '" + id + "'", dat];
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
        input.id = "box_color_edit"
        input.style.width = "16rem";
        input.style.height = "3rem";
        input.title = "box color";
        input.placeholder = "color";
        input.value = document.getElementById("box_color").innerHTML;
        document.getElementById("box_color").style.display = "none";
        document.getElementById("box_color").parentElement.appendChild(input);
    }
}


function change_box_picture(a) {
    if (a === 'true') {
        var pic = document.getElementById("box_pic_edit").files;
        if (pic != "") {
            var ip = location.host;
            var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
            socket.on('connect', () => {
                let dat = [];
                console.log(['box&'+id + '.jpg', pic[0]]);
                socket.emit('setpicture', [id + '.jpg', pic[0]]);
                dat = ["UPDATE box SET picture ='" + "box&" + id + ".jpg" + "' WHERE id = '" + id + "'", dat];
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
        input.id = "box_pic_edit"
        input.style.width = "16rem";
        input.style.height = "3rem";
        input.title = "box pic";
        input.placeholder = "pic";
        document.getElementById("box_picture").style.display = "none";
        document.getElementById("box_picture").parentElement.appendChild(input);
    }
}