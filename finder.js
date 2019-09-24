let ifaces = require('./config.json').iface

const interfaceChecker = require('./iface').iface
const profiler = require('./db').profiler
const lastPingProfiler = require('./db').lastPingProfiler
const find=require('./arp').find
const logsTime = require('./config.json').sleepTime * 1000

var lastPing = {}
module.exports.lastPing = lastPing

// Main function
function main() {

    let devicesList = []
    let shortList = []
    // console.log('starting')
    if (ifaces != null) {
        // Find all local network devices.
        find().then(pingResulte => {
            //    console.log(pingResulte.devicesList);
            // Adding the pingResulte.devicesList info to obj
            for (i in pingResulte.devicesList) {

                devicesList.push({ mac: pingResulte.devicesList[i].mac, vendor: pingResulte.devicesList[i].vendor, logs: [{ timestamp: new Date().getTime(), ip: pingResulte.devicesList[i].ip }] })
                shortList.push({ name :'',ip: pingResulte.devicesList[i].ip, mac: pingResulte.devicesList[i].mac, vendor: pingResulte.devicesList[i].vendor, lastSeen: pingResulte.timestamp })

            }

            lastPing = { timestamp: pingResulte.timestamp, devices: shortList }
            module.exports.lastPing = lastPing
            profiler(shortList)
            lastPingProfiler(lastPing)



         
            status = true
            devicesList = []
            sleep().then(() => {
                main()
            }).catch((err) => {

            })

        }).catch((err) => {

            console.log(err)
            interfaceChecker().then((iface) => { if (iface != null) { main() } })

        })
    }


}







module.exports.main = main;





const sleep = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let error = false;
            if (!error)
                resolve()
            else
                reject()
        }, logsTime)
    })
}