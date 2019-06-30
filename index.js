const moment = require('moment')
const find = require('local-devices');
const oui = require('oui');
const sleep = require('sleep');
const profiler = require('./db').profiler
const logsTime = 295

let devicesList = []


// Main function
function main() {


  console.log('starting')

  // Find all local network devices.
    find().then(devices => {

    // Adding the devices info to obj
    for (i in devices) {

      devicesList.push({ mac: devices[i].mac, vendor: ((oui(devices[i].mac)).split('\n')[0]), logs: [{ timestamp: new Date().getTime(), ip: devices[i].ip }] })

    }

    console.log("Conncted devices : " + devicesList.length)

    profiler(devicesList)
    console.log("sleep time = " + logsTime);
    sleep.sleep(logsTime)

    console.log('running agine ...')
    devicesList = []
    main()

  }).catch((err) => {

    console.log(err)
  })


}
main();


