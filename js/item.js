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
                    socket.on(id, (data) => {
                        console.log(data);
                        data.forEach((values) => {
                            document.getElementById("item_id").innerHTML = id;
                            document.getElementById("item_name").innerHTML = values.item_name;
                            document.getElementById("total_quantity").innerHTML = values.total_quantity;
                            let i = values.size;
                            let shortest = [];
                            console.log("1: " + i);
                            socket.on('getUnit', (dat) => {
                                console.log(dat);
                                dat.forEach((val) => {
                                    shortest = [...shortest, ("" + (i * parseFloat(val.multiplicator)))];
                                });
                                console.log(shortest);
                                let unit;
                                for (let i = 0; i < shortest.length; i++) {
                                    if (unit = null) {
                                        unit = i;
                                    } else {
                                        if (shortest[unit].length > shortest[i].length) {
                                            unit = i;
                                        }
                                    }
                                }
                                console.log(unit);
                                document.getElementById("item_size").innerHTML = (dat[unit].multiplicator * i);
                                document.getElementById("item_unit").innerHTML = dat[unit].name;
                            });
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
