var express = require("express");
const router = express.Router();

var {class1} = require('../controller/controller');

var path = require("path");

router.get("/page",(req,res)=>{

    console.log(process.env.SECRET_KEY);
    res.sendFile(path.join(__dirname, "../404page.html"));
    
})

router.get("/signup",class1.a);
router.post("/signup",class1.b);
router.get("/otp",class1.c);
router.post("/otp",class1.d);
// router.get("/otp",class1.e);
// router.get('/login', class1.f);
// router.post('/login', class1.g);
// router.get("/first",class1.h);

router.get("/*",(req,res)=>{

    console.log(process.env.SECRET_KEY);
    res.sendFile(path.join(__dirname, "../404page.html"));
    
})

module.exports = router;