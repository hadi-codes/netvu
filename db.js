const moment = require('moment')
moment.locale('de')
moment().format('L');

const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/myuserdb?retryWrites=true";

const MongoClient = require('mongodb').MongoClient;


function profiler(deviceList) {


    for (i in deviceList) {
        deviceProfiler(deviceList[i])
      //  console.log(deviceList[i]);
    }


}


function deviceProfiler(device) {

    // Connecting to DB

    MongoClient.connect(url, { useNewUrlParser: true }).then((db) => {
        // checking if profile already exists
      //  console.log('sss');
        db.db('nLogs').collection('profiles').findOne({ mac: `${device.mac}` }).then((doc) => {


            // if already exists =>  just log that the shit
            if (doc != null) {
                   console.log(doc);



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