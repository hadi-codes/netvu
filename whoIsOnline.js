const find = require('./finderV2').find;
const oui = require('oui');
  

function whoIsOnline(){
return new Promise((resolve, reject) =>{
  find().then((devices)=>{
    let devicesList = [];
  
     resolve({timestamp:new Date().getTime(),devices:devices});
  })
     
   
  });

}
 
  
  module.exports.whoIsOnline=whoIsOnline
  