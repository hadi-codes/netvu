let ifaces = require("./config.json").iface;

const profiler = require("./db").profiler;
const lastPingProfiler = require("./db").lastPingProfiler;
const nmap = require("./nmap").scan;
const logsTime = require("./config.json").sleepTime * 1000;

let lastPing = {};

// Main function
function main() {
  let lp = {};
  let devicesList = [];
  let shortList = [];
  // console.log('starting')

  // Find all local network devices.
  nmap()
    .then(resulte => {
      //    console.log(resulte.devicesList);
      // Adding the resulte.devicesList info to obj

      resulte.devices.forEach(device => {
        devicesList.push({
          mac: device.mac,
          vendor: device.vendor,
          logs: [{ timestamp: resulte.devices.timestamp, ip: device.ip }]
        });
        shortList.push({
          name: "",
          ip: device.ip,
          mac: device.mac,
          vendor: device.vendor,
          lastSeen: resulte.devices.timestamp
        });
      });

      lp = { timestamp: resulte.timestamp, devices: shortList };
      console.log(lp);
      module.exports.lastPing = lp;
      profiler(shortList);
      lastPingProfiler(lp);

      status = true;
      devicesList = [];
      sleep()
        .then(() => {
          main();
        })
        .catch(err => {});
    })
    .catch(err => {
      console.log(err);
      //   interfaceChecker().then(iface => {
      //     if (iface != null) {
      //       main();
      //     }
      //   });
    });
}

const sleep = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let error = false;
      if (!error) resolve();
      else reject();
    }, logsTime);
  });
};
module.exports.main = main;
module.exports.lastPing = lastPing;
