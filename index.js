const moment = require('moment')
const express = require('express');
const app = express();
const finder = require('./finder')
const path = require('path');
const whoIsOnline = require('./whoIsOnline').whoIsOnline
app.use(express.static('public'));
const port = process.env.PORT || 3001;
const info = require('./info').info
app.listen(port);


finder.main()




//console.log(whoIsOnline);


app.get('/', (req, res) => {
  res.send('Hello fam');
});




app.get('/whoIsOnline', (req, res) => {




  whoIsOnline().then((report) => {
    res.send(report)
  })



})


app.get('/lastping', (req, res) => {
  let lastPingProfiler = require('./db').lastPingProfiler
  console.log(finder.lastPing);
  lastPingProfiler(finder.lastPing).then((d) => {
    
    console.log(d);
    res.send(d)
  })
  //console.log(lp);

  // res.send(finder.lastPing)
})



app.get('/info/:mac', (req, res) => {
  let mac = req.params.mac
  //  console.log(req.params.mac);
  info(mac).then((doc) => {

    res.send(doc)

  }).catch((err) => {
    res.send(err)
  })
})

console.log(`listing on port .... ${port}`);

module.exports = app;