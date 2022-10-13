var Todo = require("../models/schema")
// var { Todo1 , Todo2 } = require("../models/schema")

var jwt = require("jsonwebtoken");
var path = require("path");
var bcrypt = require("bcryptjs");
var nodemailer = require('nodemailer');
var fs = require('fs');

const schedule = require('node-schedule');
const session = require("express-session");

var SECRET_KEY = process.env.SECRET_KEY || "YOURSECRETKEYGOESHERE";
var expirestime = process.env.expirestime || 1000;

class class1 {

    static a = async (req, res) => {

        try {

            if (req.session.userid) {

                await Todo.findOne({ signuptoken: req.session.userid }).deleteOne();

                req.session.destroy();

            }

            res.render("signup");

        } catch (err) {

            console.log(err);

        }

    }

    static b = async (req, res) => {

        try {

            var user = await Todo.findOne({ username: req.body.username });

            if (user == null && req.body.password == req.body.confirmpassword) {

                var signuptoken = jwt.sign({ username: req.body.username }, SECRET_KEY);

                function between(min, max) {
                    return Math.floor(
                        Math.random() * (max - min) + min
                    )
                }

                var otp = between(100000, 999999);

                var sessionstore = req.session;
                sessionstore.userid = signuptoken;
                sessionstore.save();

                let bufferdata = await fs.readFileSync(path.join(__dirname, "../../public/profile_pic.png"));

                let data = new Todo({

                    username: req.body.username,
                    password: await bcrypt.hash(req.body.password, 12),
                    confirmpassword: req.body.confirmpassword,
                    Email: req.body.Email,
                    otp: otp,
                    signuptoken: signuptoken,
                    userimg: {
                        data: bufferdata,
                        contentType: 'image/png'
                    },
                    Following: [],
                    Followers: [],
                    Bio: "",
                    post: [],
                    complete: "no"

                })

                await data.save();

                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'nikunjghpghari456@gmail.com',
                        pass: 'svkadtefcqhtqryj'
                    }
                });

                fs.readFile(path.join(__dirname, "../../public/instagram.png"), function (err, data2) {

                    fs.readFile(path.join(__dirname, "../../public/Nikxgram.png"), function (err, data) {

                        var mailOptions = {
                            from: 'nikunjghpghari456@gmail.com',
                            to: `${req.body.Email}`,
                            subject: 'Sending Email using Node.js',
                            text: 'That was easy!',
                            html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                            <div style="margin: 50px auto;width:450px;padding:20px 0" ;>
                              <div style="border-bottom:1px solid #eee;">
                                <img src="cid:img2" alt="instagram" style="width: 40px;margin-left: 35px;">
                                <img src="cid:img" alt="nikxgram" style="width: 155px;margin-left: 35px;">
                              </div>
                              <p style="font-size:1.1em">Hii</p>
                              <p>Use this code to create your account into nikxgram safely.</p>
                              <h2 style="background: #00466a;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                              <!-- <hr style="border:none;border-top:1px solid #eee" /> -->
                              <!-- <div style="color:#aaa;font-size:0.8em;line-height:1;font-weight:300;width: 50%;display: flex;justify-content: center;">
                            <p>Nikxgram</p>
                          </div> -->
                              <div style="text-align: center;">
                                <p style="margin: 0 auto;color:#aaa">From</p>
                                <p style="margin: 0 auto;color:black">Nikxgram</p>
                              </div>
                            </div>`,
                            attachments: [{
                                filename: 'Nikxgram.png',
                                content: data,
                                cid: "img",
                            },
                            {
                                filename: 'instagram.png',
                                content: data2,
                                cid: "img2",
                            }]
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                    });

                });

                res.redirect('/otp');

            } else if (user == null) {

                res.render('waiting');

            } else {

                res.render('wait');
            }

        } catch (err) {

            console.log(err);

        }

    }

    static c = async (req, res) => {

        try {

            if (req.session.userid) {

                var user = await Todo.findOne({ signuptoken: req.session.userid });

                res.render('otp', { user });

            } else {

                res.sendFile(path.join(__dirname, "../404page.html"));

            }

        } catch (err) {

            console.log(err);

        }

    }

    static d = async (req, res) => {

        try {

            var user = await Todo.findOne({ signuptoken: req.session.userid });

            if (req.body.otp == user.otp) {

                var updateuser = await Todo.findOneAndUpdate({ signuptoken: req.session.userid }, { $set: { complete: "yes" } });
                await updateuser.save();

                req.session.destroy();

                res.redirect('login');

            } else {

                await Todo.findOne({ signuptoken: req.session.userid }).deleteMany();
                req.session.destroy();

                res.render("otpwait")

            }

        } catch (err) {

            console.log(err)

        }

    }

    static e = async (req, res) => {

        try {
            res.render("login");
        } catch (err) {
            console.log(err);
        }

    }

    static f = async (req, res) => {

        try {

            var logindata = await Todo.findOne({ username: req.body.loginusername })

            var Passwordmatch = await bcrypt.compare(req.body.loginpassword, logindata.password);

            if (Passwordmatch) {

                var logintoken = await jwt.sign({ username: req.body.loginusername }, SECRET_KEY);

                var sessionstore = req.session;
                sessionstore.signuptoken = logindata.signuptoken;
                sessionstore.save();

                res.cookie("logintoken", logintoken
                    , {
                        expires: new Date(Date.now() + expirestime),
                        httpOnly: true
                    });
                var updateuser = await Todo.findOneAndUpdate({ signuptoken: req.session.signuptoken }, { $set: { logintoken: logintoken } });
                await updateuser.save();

                res.redirect('/first');

            } else {

                res.render("password");

            }

        } catch (err) {

            res.render("user");

        }

    }

    static g = async (req, res) => {

        try {

            if (req.cookies.logintoken) {

                var logindata = await Todo.findOne({ logintoken: req.cookies.logintoken })

                if (logindata.complete == "yes") {
                    res.render('first');
                } else {
                    res.render('second');
                }

            } else if (req.session.signuptoken) {

                var logintoken = jwt.sign({ username: req.body.loginusername }, SECRET_KEY);

                res.cookie("logintoken", logintoken
                    , {
                        expires: new Date(Date.now() + expirestime),
                        httpOnly: true
                    });

                res.redirect('/first');

            } else {

                res.sendFile(path.join(__dirname, "../404page.html"));

            }

        } catch (err) {

            console.log(err)

        }

    }

    // static g = async (req, res) => {

    //     var a = await FirstCollection.findOne({ token: req.cookies.token })

    //     var ab = a.userimg

    //     var abcd = a.Following
    //     var b = a.username  // login username

    //     var ar = await FirstCollection.find();
    //     var supplies = []
    //     var supplies1 = []
    //     var supplies4 = []
    //     var d = []
    //     var com = [] // it's set 0 index value bcz ortherwise when user first times like then does not redirect

    //     ar.forEach(element => {

    //         if (element.username != b) {

    //             // supplies.push(element.username);
    //             supplies.push(element);

    //         }

    //     });

    //     for (let i = 0; i < supplies.length ; i++) {

    //         supplies1.push(supplies[i].userimg);
    //         supplies4.push(supplies[i].username);

    //         }

    //     //   var a = await FirstCollection.findOne({ token: req.cookies.token })
    //     //   var abcd = a.Following
    //     //   var b = a.username  // login username

    //     //   var ar = await FirstCollection.find();
    //     //   var supplies = []
    //     //   var supplies1 = []
    //     //   var supplies4 = []
    //     //   var supplies5 = []
    //     //   var last = []  

    //     //   ar.forEach(element => {

    //     //       if (element.username != b) {

    //     //           // supplies.push(element.username);
    //     //           supplies.push(element);

    //     //       }

    //     //   });

    //     //   function PUSH() {
    //     //       c.push(a, supplies);
    //     //   }
    //     //   var c = [];
    //     //   PUSH();

    //     //   for (let i = 0; i < supplies.length ; i++) {

    //     //       supplies1.push(supplies[i].userimg);
    //     //       supplies4.push(supplies[i].username);
    //     //       supplies5.push(supplies[i]);

    //     //   function isInArray(value, array) {
    //     //       return array.indexOf(value) > -1;
    //     //     }

    //     //   var ologic = isInArray(supplies4[i], abcd);

    //     //   last.push(ologic);

    //     //     }

    //     var abc = await FirstCollection.find()

    //     res.render('story' , { a , b , ab , abc , supplies1 , supplies4 , com , d })
    // }

    static th = async (req, res) => {
        res.render("th")
    }

}

module.exports = { class1 };