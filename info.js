const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/myuserdb?retryWrites=true";
const MongoClient = require('mongodb').MongoClient;

function info(mac) {
    return new Promise((resolve, reject) => {

        MongoClient.connect(url, { useNewUrlParser: true }).then((db) => {
            console.log(mac);


            db.db('networkLogs').collection('profiles').findOne({ mac: `${mac}` }).then((doc) => {
                console.log(doc);
                if (doc == null) {
                    reject('not found')
                    db.close()
                }
                else {
                    delete doc.logs
                    resolve(doc)
                    db.close()
                }


            }).catch((err) => {
                console.log(err);
                reject(err)

            })

        }).catch((err) => {
            console.log(err);
            reject(err)

        })
    })
}


module.exports.info = info