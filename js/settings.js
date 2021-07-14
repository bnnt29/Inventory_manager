function getsettings() {
    var settings_load = false;
    var ip = location.host;
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.on('connect', () => {
        socket.on('getsettings', (data) => {
            if (!settings_load) {
                document.getElementById("database_location").placeholder = data[0];
                document.getElementById("server_1_ip").placeholder = data[1];
                document.getElementById("server_1_port").placeholder = data[2];
                if (data[3] === 'true') {
                    document.getElementById("server_2_use_true").checked = true;
                    toggle(true);
                } else {
                    document.getElementById("server_2_use_false").checked = true;
                    toggle(false);
                }
                document.getElementById("server_2_ip").placeholder = data[4];
                document.getElementById("server_2_port").placeholder = data[5];
                settings_load = true;
            }
        })
    });
}

function toggle(bool) {
    if (bool) {
        document.getElementById("collapseOne").style.display = 'block';
    } else {
        document.getElementById("collapseOne").style.display = 'none';
    }
}

function setsettings() {
    var settings_set = false;
    var ip = location.host;
    var settings = [
        document.getElementById("database_location").value,
        document.getElementById("server_1_ip").value,
        document.getElementById("server_1_port").value,
        document.getElementById("server_2_use_true").checked,
        document.getElementById("server_2_ip").value,
        document.getElementById("server_2_port").value]
    var socket = io('http://' + ip, { transports: ["websocket"] }); // connect to server
    socket.on('connect', () => {
        if (!settings_set) {
            socket.emit('setsettings', settings);
        }
    });
}