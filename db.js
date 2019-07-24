const moment = require('moment')
const ObjectId = require('mongodb').ObjectId
//const lastping=require('./finder').lastPing
moment.locale('de')
moment().format('L');

const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/myuserdb?retryWrites=true";

const MongoClient = require('mongodb').MongoClient.connect(url, { useNewUrlParser: true })

function profiler(deviceList) {
return new Promise(async(resolve,reject)=>{
    
/// shit to do herre    sfdoihghfsidgoipusgsdfdgjdifhgkdjfhg
    deviceList.forEach(async(i) => {
        deviceProfiler(i)
     //   console.log('object');
    })
console.log('done');
    resolve()

})

   


}


function pushToDB(lastPing){

MongoClient.then((db)=>{
db.db('nLogs').collection('lastPing').updateOne({_id:new ObjectId('5d38e4d81c9d440000e906f8')},{$set:{lastPing:lastPing}}).then(()=>{
    console.log('done insert lastping');
    db.close()
})
})

}
module.exports.pushToDB=pushToDB

function deviceProfiler(device) {




    // Connecting to DB


    MongoClient.then((db) => {
        // checking if profile already exists
      //  console.log('sss');
    
        db.db('nLogs').collection('profiles').findOne({ mac: `${device.mac}` }).then((doc) => {


            // if already exists =>  just log that the shit
            if (doc != null) {
                  // console.log(doc);



                db.db('nLogs').collection('profiles').updateMany({ mac: `${device.mac}` },{ $push: { logs: { timestamp: device.logs[0].timestamp, ip: device.logs[0].ip } } }, {$set:{lastSeen:new Date().getTime()}}).then(() => {
                console.log('update a doc');
                    db.close();
                
                })

                    .catch((err) => {
                        console.log(err)
                    })




            }
            // if the profile not found => create new profile and add first seen
            else {
                console.log('doc not found');
                device.firstSeen = new Date().getTime()
                device.name = ""
                device.lastSeen=new Date().getTime()
                db.db('nLogs').collection('profiles').insertOne(device).then(() => {

                   
                    db.close();
                    //   console.log('closing db')

                })

                    // err handler for inserting 
                    .catch((err) => {
                        console.log(err)
                    })


            }
        })



            //err handler for query

            .catch((err) => {
                console.log(err)
            })

        /*
              */



    }) // MC error Handler
        .catch((err) => {


            console.log(err)
        })


}





module.exports.profiler = profiler;