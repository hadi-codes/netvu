const find = require('./finderV2').find;
const oui = require('oui');
const pushToDB=require('./db').pushToDB
const profiler = require('./db').profiler
const logsTime = 29 * 1000
var status=false
var lastPing={}
module.exports.lastPing=lastPing
module.exports.status=status
// Main function
function main() {
    status=true
    let devicesList = []
    let shortList=[]
   // console.log('starting')

    // Find all local network devices.
    find().then(devices => {
        status=true
        // Adding the devices info to obj
        for (i in devices) {

            devicesList.push({ mac: devices[i].mac, vendor: devices[i].vendor, logs: [{ timestamp: new Date().getTime(), ip: devices[i].ip }] })
            shortList.push({ ip:devices[i].ip,mac: devices[i].mac, vendor: devices[i].vendor})
        
        }
        
        //console.log("Conncted devices : " + devicesList.length)
        lastPing={timestamp:new Date().getTime(),devices:shortList}
    //   
        module.exports.lastPing=lastPing
        profiler(devicesList)
        pushToDB(lastPing)
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