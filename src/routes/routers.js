var express = require("express");
const router = express.Router();

var {class1} = require('../controller/controller');

var path = require("path");

var Todo = require("../models/schema")

const schedule = require('node-schedule');

const job = schedule.scheduleJob('00 00 00 * * *', async function(){

    await Todo.findOne({ complete: "no" }).deleteMany();
    console.log("Hi");

});

// var CronJob = require('cron').CronJob;
// var job = new CronJob('00 00 12 * * 0-6', function() {
//   /*
//    * Runs every day
//    * at 12:00:00 AM.
//    */
//   }, function () {
//     /* This function is executed when the job stops */
//   },
//   true, /* Start the job right now */
//   timeZone /* Time zone of this job. */
// );  // add also routes ( routes under data save without complete field ) if success then add maintenance page and check ortherwise setting page 

router.get("/page",(req,res)=>{

    console.log(process.env.SECRET_KEY);
    res.sendFile(path.join(__dirname, "../404page.html"));
    
})

router.get("/signup",class1.a);
router.post("/signup",class1.b);
router.get("/otp",class1.c);
router.post("/otp",class1.d);
router.get('/login', class1.e);
// router.post('/login', class1.g);
// router.get("/first",class1.h);

router.get("/*",(req,res)=>{

    console.log(process.env.SECRET_KEY);
    res.sendFile(path.join(__dirname, "../404page.html"));
    
})

module.exports = router;