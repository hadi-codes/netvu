const moment = require('moment')
const express = require('express');
const app = express();
const finder=require('./finder')

const whoIsOnline=require('./whoIsOnline').whoIsOnline

const port = process.env.PORT || 3001;

app.listen(port);


finder.main()




//console.log(whoIsOnline);


app.get('/', (req, res) => {
  res.send('Hello fam'+finder);
});

app.get('/finder/',(req,res)=>{
  res.send(JSON.stringify({finderStatus:finder.status}))
})


app.get('/whoIsOnline',(req,res)=>{




whoIsOnline().then((report)=>{
res.send(report)})



})







console.log(`listing on port .... ${port}`);

module.exports = app;