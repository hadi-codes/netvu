const moment = require('moment')
const find = require('local-devices');
const oui = require('oui');




var whoIsOnline = new Promise((resolve, reject) => {

    // Find all local network devices.
    find().then(devices => {
        var devicesList = [];
        let report = {};
        // Adding the devices info to obj
        for (i in devices) {

            devicesList.push({ mac: devices[i].mac, vendor: ((oui(devices[i].mac)).split('\n')[0]), ip: devices[i].ip })

        }



        report = { timestamp: new Date().getTime(), devicesList: devicesList }

        resolve(report);
    }).catch((err) => {
        reject(err)
    })




});

whoIsOnline.then(report => {
    console.log(report); // Success!
}, err => {
    console.log(err); // Error!
});



