const nmap = require("libnmap");
const opts = {
  threshold: 2048,
  json: true,
  blocksize: 1,
  range: ["192.168.0.0/24"],
  //flags: [ "-sP","-PR"],
  timeout: 1
  //verbose: true,
  //udp: true,
};


function scan() {
  return new Promise((resolve, reject) => {
    /*
        scanResulte ... using it to save nmap scan resulte
    */
    let scanResulte = { timestamp: 0, devices: [] };

    nmap_scan().then(res => {
      for (let item in res) {
        //getting finished scan timestamp
        scanResulte.timestamp = res[item].runstats[0].finished[0].item.time;
        hosts = res[item].host;
        hosts.forEach(host => {
          let device = {};
          device.ip = host.address[0].item.addr;
          // doesnt return mac add. for the scanning device
          if (host.address[1] != undefined) {
            device.mac = host.address[1].item.addr;
            device.vendor = host.address[1].item.vendor;
            scanResulte.devices.push(device);
          }
        });
      }
      resolve(scanResulte);
    });
  });
}

function nmap_scan() {
  return new Promise((resolve, reject) => {
    nmap.scan(opts, function(err, report) {
      if (err) reject(err);
      resolve(report);
    });
  });
}


module.exports.scan=scan