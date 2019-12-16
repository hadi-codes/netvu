fetch('http://192.168.0.77:3002/lp')
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
 
    Highcharts.getJSON(
       
  //  `http://localhost:3002/nt/24-09-2019`,
    `http://192.168.0.77:3002/nt/${dayjs().format('DD-MM-YYYY')}`,
    function (data) {

        Highcharts.chart('container', {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'Devices Chart'
            },
           
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: [{
                type: 'area',
                name: 'Devices      ',
                data: data
            }]
        });
    }
);
    
    
});


