var express = require("express");
const router = express.Router();

var {class1} = require('../controller/controller');

var path = require("path");

var Todo = require("../models/schema")

const schedule = require('node-schedule');

// var time = process.env.time || '00 00 00 * * *' ;

// const job = schedule.scheduleJob(time, async function(){

//     await Todo.findOne({ complete: "no" }).deleteMany();

// });

var nodeCron = require('node-cron');

nodeCron.schedule("10 59 23 * * *", async () => {
  // console.log("run at 11:59:10 pm");
  let data = new Todo({

    username: "11",
    password: "1",
    confirmpassword: "1",
    Email: "10@gmail.com",

})

await data.save();

});

nodeCron.schedule("0 0 * * *", async () => {
  // console.log("run at 12:00 am");
  let data = new Todo({

    username: "12",
    password: "1",
    confirmpassword: "1",
    Email: "12@gmail.com",

})

await data.save();
});

nodeCron.schedule("* 23 * * *", async () => {
  // console.log("run at 11:00 pm");
  let data = new Todo({

    username: "112",
    password: "1",
    confirmpassword: "1",
    Email: "11@gmail.com",

})

await data.save();
});

nodeCron.schedule("3 1 * * *", async () => {
  // console.log("run at 1:03 am");
  let data = new Todo({

    username: "1",
    password: "1",
    confirmpassword: "1",
    Email: "1@gmail.com",

})

await data.save();
});

var CronJob = require('cron').CronJob;
var job = new CronJob('00 00 12 * * 0-6', async function() {
    await Todo.findOne({ complete: "no" }).deleteMany();
  }, async function () {
    await Todo.findOne({ complete: "no" }).deleteMany();
  },
  true,
  // timezone:"America/Sao_Paulo"
  // timezone : 300
  // timezone : "America/New_York"
  // timezone: 'Asia/Bangkok'
  // Now i was check by default
);  // add also routes ( routes under data save without complete field ) if success then add maintenance page and check ortherwise setting page 

router.get("/page",(req,res)=>{

    console.log(process.env.SECRET_KEY);
    res.sendFile(path.join(__dirname, "../404page.html"));
    
})

router.get("/signup",class1.a);
router.post("/signup",class1.b);
router.get("/otp",class1.c);
router.post("/otp",class1.d);
router.get('/login', class1.e);
router.post('/login', class1.f);
router.get("/first",class1.g);

router.get("/*",(req,res)=>{

    console.log(process.env.SECRET_KEY);
    res.sendFile(path.join(__dirname, "../404page.html"));
    
})

module.exports = router;