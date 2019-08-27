const express = require('express');
const app = express();
const finder = require('./finder')
const getLastPing=require('./db').getLastping
app.use(express.static('public'));
const port = process.env.PORT || 3002;
const info = require('./info').info
app.listen(port);


finder.main()




//console.log(whoIsOnline);


app.get('/', function(req, res){
  res.sendfile(__dirname + '/public/index.html');
});






app.get('/lp',(req,res)=>{
    
  getLastPing().then((lp)=>{
   // console.log(lp);
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.send(lp)
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