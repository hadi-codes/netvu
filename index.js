const moment=require('moment')
const find = require('local-devices');
const oui = require('oui');
const sleep = require('sleep');
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/myuserdb?retryWrites=true";

// Create a new MongoClient
const MongoClient = require('mongodb').MongoClient;

var f=true

var devicesList=[]



  function main(){
console.log('starting')
  
// Find all local network devices.
find().then(devices => {
var ff
 
 for(i in devices){
        
     devicesList.push({ip:devices[i].ip,mac:devices[i].mac,vendor:((oui(devices[i].mac)).split('\n')[0])})
     
  }
  console.log(devicesList)
  
 

 }).catch((err)=>{
 
   console.log(err)
 }).then(()=>{


 console.log('waiting for 60 s ...')


 MongoClient.connect(url,{useNewUrlParser:true}).then((db)=>{


  db.db('networkLogs').collection('logs').insertOne({time:moment().format(),devices:devicesList}).then(()=>{
    
    db.close()
  console.log('closing db')
  sleep.sleep(60)
  console.log('running agine ...')
  devicesList=[]
   main()
})
   })
   .catch((err)=>{
     
    
    console.log(err)
  })
  
   
 }).catch((err)=>{console.log(err)})
 
  }

main()

 




 /*

.then((yes)=>{
  let runItmore = new Promise((resolve, reject) => {
    if (yes == true) {
        resolve(true)
    } else { reject(false) }
  })
   console.log(devicesList)
   console.log('conncting to db ...')
 
   
   sleep.sleep(60)
   devicesList=[]
   runItmore.then((main()))
 })

 MongoClient.connect(url,{useNewUrlParser:true}).then((db)=>{
    console.log('inserting log')
    
    db.db('networkLogs').collection('logs').insertOne({time:moment().format(),devices:devicesList}).then(()=>{db.close()})
   })
*/