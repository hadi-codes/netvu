//const si = require('systeminformation');
const scanner = require('local-network-scanner');
const oui = require('oui');
let iface=require('./config.json').iface
const sudo = require('sudo');



const ifaces=require('./config.json').iface
//console.log(config);

function find(){
    return new Promise((resolve,reject)=>{
        
    
  
let net={}
let devicesList=[]


    let promises = []
    ifaces.forEach((id) => {
        promises.push(pingo( { arguments: ["-I", `${id}`] }))
    })
    
    Promise.all(promises)
        .then((result) => {
           
        
            for (i in result){
                net[ifaces[i]]=result[i]
            }
            for(i in iface){
   
                for (x in net[iface[i]]){
                  devicesList.push(net[iface[i]][x])
                }
                // console.log(devices);
                  }
            resolve(devicesList)

        })




    })

}
















































































function pingo(options) {

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







module.exports.find=find