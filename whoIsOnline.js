const find = require('local-devices');
const oui = require('oui');


function whoIsOnline(){
return new Promise((resolve, reject) =>{
  find().then((devices)=>{
    let devicesList = [];
    for (i in devices) {
    
        devicesList.push({ mac: devices[i].mac, vendor: ((oui(devices[i].mac)).split('\n')[0]), ip: devices[i].ip })

    }
  
    resolve({timestamp:new Date().getTime(),devicesList:devicesList});
  })
     
   
  });

}
 
  
  module.exports.whoIsOnline=whoIsOnline
  