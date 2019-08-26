const moment = require('moment')
const ObjectId = require('mongodb').ObjectId
moment.locale('de')
moment().format('L');
const collection={name:"nLog3",logs:"logs",profiles:"profiles"}

const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/myuserdb?retryWrites=true";

const MongoClient = require('mongodb').MongoClient.connect(url, { useNewUrlParser: true })

function profiler(deviceList) {

    deviceList.forEach((i) => {
        deviceProfiler(i)
      

    })
    console.log('done');

}




function deviceProfiler(device) {




    // Connecting to DB


    MongoClient.then((db) => {
        // checking if profile already exists
        //  console.log('sss');

        db.db(collection.name).collection(collection.profiles).findOne({ mac: `${device.mac}` }).then((doc) => {


            // if already exists =>  just log that the shit
            if (doc != null) {
                // console.log(doc);



                db.db(collection.name).collection(collection.profiles).updateMany({ mac: `${device.mac}` }, { $set: { lastSeen:device.lastSeen,ip:device.ip } }).then(() => {
                    //  console.log('update a doc');
                    //    db.close();

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
                device.lastSeen = device.lastSeen

                db.db(collection.name).collection(collection.profiles).insertOne(device).then(() => {


                    // db.close();
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



function logger(arpRes) {
    delete arpRes.devices
    let date = { timestamp: arpRes.timestamp, device: arpRes.devicesLogs }
    //console.log(arpRes);
    return new Promise((resolve, reject) => {
        let date = moment().format('DD-MM-YYYY')

        MongoClient.then((db) => {
            // checking if profile already exists
            //  console.log('sss');

            db.db(collection.name).collection(collection.logs).findOne({ date: date }).then((doc) => {


                // if already exists =>  just log that the shit
                if (doc != null) {
                    // console.log(doc);



                    db.db(collection.name).collection(collection.logs).updateOne({ date: date }, { $push: { logs: arpRes } }).catch((err) => {
                        console.log(err)
                    })



                }
                // if the profile not found => create new profile and add first seen
                else {

                    db.db(collection.name).collection(collection.logs).insertOne({ date: date, logs: [arpRes] })

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
    })
}
module.exports.logger = logger







function pushToDB(lastPing) {

    MongoClient.then((db) => {
        db.db(collection.name).collection('lastPing').updateOne({ lable:'lastPing'}, { $set: { lastPing: lastPing } }).then(() => {
            console.log('done insert lastping');
        })
    })

}




function lastPingProfiler(nlastPing) {

    return new Promise((resolve, reject) => {


        let lastPing = { timestamp: nlastPing.timestamp, devices: [] }
        MongoClient.then((db) => {

            nlastPing.devices.forEach((i) => {
                lastPing.devices.push(db.db(collection.name).collection(collection.profiles).findOne({ mac: `${i.mac}` }))

            })

            Promise.all(lastPing.devices).then((docs) => {

                let deviceList = []
                let lastPing
                docs.forEach((i) => {
                    console.log(i);
                    deviceList.push({ name: i.name, ip: i.ip, mac: i.mac, vendor: i.vendor, status: true });
                    lastPing = { time: moment(nlastPing.timestamp).format(), devices: deviceList }

                })


                pushToDB(lastPing)
                resolve(lastPing)


            })



        }).catch((err) => {
            console.log(err);
        })



    })

}
module.exports.lastPingProfiler = lastPingProfiler


