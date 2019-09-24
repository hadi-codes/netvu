
// Getting the networkInterfaces and save it in to config file
const si = require('systeminformation')
const editJsonFile = require("edit-json-file");

let file = editJsonFile(`config.json`, {
    autosave: true
});

function iface() {

    return new Promise((resolve, reject) => {
        let ifaces = []
        si.networkInterfaces().then((data) => {
            for (i in data) {
                if (data[i].ip4 != '127.0.0.1') {
                    ifaces.push(data[i].iface)

                }

            }

            resolve(ifaces)
            file.set("iface", ifaces)
           // console.log(ifaces);

        })
    })
}

module.exports.iface = iface