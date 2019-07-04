const find = require('local-devices');
const oui = require('oui');
const profiler = require('./db').profiler
const logsTime = 295 * 1000
var status=false
module.exports.status=status
// Main function
function main() {
    status=true
    let devicesList = []
   // console.log('starting')

    // Find all local network devices.
    find().then(devices => {
        status=true
        // Adding the devices info to obj
        for (i in devices) {

            devicesList.push({ mac: devices[i].mac, vendor: ((oui(devices[i].mac)).split('\n')[0]), logs: [{ timestamp: new Date().getTime(), ip: devices[i].ip }] })

        }

        //console.log("Conncted devices : " + devicesList.length)

        profiler(devicesList)
      //  console.log("sleep time = " + logsTime / 1000);


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
        status=true
        devicesList = []
        sleep().then(() => {
         //   console.log('running agine ...')
            main()
        }).catch((err)=>{
            status=false
        })

    }).catch((err) => {
        status=false
        console.log(err)
    })
    module.exports.status=status

    
}

module.exports.main = main;