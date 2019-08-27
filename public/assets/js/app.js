fetch('https://netvu.xln.me/lp')
    .then(function (response) {
        return response.json();
    })
    .then(function (res) {



        var devices = res.devices
        var row = []
        var offlineDevices = 0
        var onlineDevices = 0
        for (i in devices) {
            row.push([devices[i].ip, devices[i].mac, devices[i].name, devices[i].status, devices[i].vendor]);
            if (devices[i].status == false) {
                offlineDevices++
            } else {
                onlineDevices++
            }
        }
      document.getElementById("lastUpdate").innerHTML = "       LAST UPDATE : "+
(      dayjs(res.timestamp).format('YYYY/MM/DD HH:mm:ss')
)    
    document.getElementById("all-devices").innerHTML = devices.length;
    
        document.getElementById("online-devices").innerHTML = onlineDevices;
        document.getElementById("offline-devices").innerHTML = offlineDevices;

        $(document).ready(function () {
            $('#dtable').DataTable({
                searching: false,
                paging: false,
                "bInfo": false,
                data: row,
                columns: [
                    { title: "ip" },
                    { title: "mac" },
                    { title: "name" },
                    { title: "status" },
                    { title: "vendor" }]

            });
        });


    });