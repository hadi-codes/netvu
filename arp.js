const oui = require('oui');
const sudo = require('sudo');
let ifaces = require('./config.json').iface
const interfaceChecker = require('./iface').iface
const logger = require('./db').logger




function find() {
    return new Promise((resolve, reject) => {



        let net = {}
        let devicesList = []
        let logs = {}


        let promises = []
        ifaces.forEach((id) => {

            promises.push(arp({ arguments: ["-I", `${id}`] }).catch((err) => {
                reject("interface not found")
            }))
        })

        Promise.all(promises)
            .then((arpRes) => {
                if (arpRes != 0) {
                    // here where arp respone get sorted 
                    // because sometimes the user have more than interface
                    //have to return logs array 
                    // and device list with timestamp
                    logs.timestamp = (arpRes[0].timestamp)
                    logs.devicesLogs = []
                    logs.cache = {}
                    for (i in arpRes) {

                        net[ifaces[i]] = arpRes[i].devices
                        logs.cache[ifaces[i]] = arpRes[i].devicesLogs

                    }


                    for (i in ifaces) {

                        for (x in net[ifaces[i]]) {
                            devicesList.push(net[ifaces[i]][x])

                        }
                        for (b in logs.cache[ifaces[i]]) {
                            logs.devicesLogs.push(logs.cache[ifaces[i]][b])
                        }

                    }
                    delete logs.cache

                    resolve({ timestamp: arpRes[0].timestamp, devicesList: devicesList })

                    logger(logs)
                } else {
                    interfaceChecker()
                }
            })



    })

}


module.exports.find = find



function arp(options) {

    return new Promise((resolve, reject) => {
        let logs = []
        let arpRes = {}
        const IP_INDEX = 0;
        const MAC_ADDRESS_INDEX = 1;


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


            if (code !== 0) {
                console.log('Error: ' + code + ' : ' + errorStream);
                reject('interface not found')
                return;
            }
            arpRes.timestamp = new Date().getTime()
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
                    device.vendor = ((oui(device.mac)).split('\n')[0])
                }
                logs.push({ ip: device.ip, mac: device.mac })
                devices.push(device);
            }
            arpRes.timestamp = new Date().getTime()
            arpRes.devicesLogs = logs
            arpRes.devices = devices
            //console.log(arpRes);
            resolve(arpRes)

        });

    })
}