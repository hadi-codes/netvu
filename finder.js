const sudo = require('sudo');
const ifaces=require('./config.json').iface
const oui = require('oui');
const profiler = require('./db').profiler
const lastPingProfiler=require('./db').lastPingProfiler
const logsTime = require('./config.json').sleepTime * 1000

var lastPing={}
module.exports.lastPing=lastPing

// Main function
function main() {

    let devicesList = []
    let shortList=[]
   // console.log('starting')

    // Find all local network devices.
    find().then(devices => {

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
        lastPingProfiler(lastPing)
     
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
      
        })

    }).catch((err) => {
       
        console.log(err)
    })
    

    
}

function find(){
    return new Promise((resolve,reject)=>{
        
    
  
let net={}
let devicesList=[]


    let promises = []
    ifaces.forEach((id) => {
        promises.push(arp( { arguments: ["-I", `${id}`] }))
    })
    
    Promise.all(promises)
        .then((result) => {
           
        
            for (i in result){
                net[ifaces[i]]=result[i]
            }
            for(i in ifaces){
   
                for (x in net[ifaces[i]]){
                  devicesList.push(net[ifaces[i]][x])
                }
                // console.log(devices);
                  }
            resolve(devicesList)

        })




    })

}





function arp(options) {

    return new Promise((resolve, reject) => {

        
        const IP_INDEX = 0;
        const MAC_ADDRESS_INDEX = 1;

     //   console.log('Start scanning network');

        let commandArguments = ['-l', '-q'];
        if (options && options.arguments) {
            commandArguments = commandArguments.concat(options.arguments)
        }

        const arpCommand = sudo(['arp-scan'].concat(commandArguments));

        let bufferStream = '';
        let errorStream = '';


        arpCommand.stdout.on('data', data => {
            bufferStream += data;
        });

        arpCommand.stderr.on('data', error => {
            errorStream += error;
        });


        arpCommand.on('close', code => {
        //    console.log('Scan finished');

            if (code !== 0) {
                console.log('Error: ' + code + ' : ' + errorStream);
                return;
            }

            const rows = bufferStream.split('\n');
            const devices = [];

            for (let i = 2; i < rows.length - 4; i++) {
                const cells = rows[i].split('\t').filter(String);
                const device = {};

                if (cells[IP_INDEX]) {
                    device.ip = cells[IP_INDEX];
                }

                if (cells[MAC_ADDRESS_INDEX]) {
                    device.mac = cells[MAC_ADDRESS_INDEX];
                  device.vendor=((oui(device.mac)).split('\n')[0])
                }

                devices.push(device);
            }

            resolve(devices)

        });
        
    })
}


module.exports.main = main;