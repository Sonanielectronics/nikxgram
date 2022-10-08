var Todo = require("../models/schema")
// var { Todo1 , Todo2 } = require("../models/schema")

var jwt = require("jsonwebtoken");
var path = require("path");
var bcrypt = require("bcryptjs");
var nodemailer = require('nodemailer');
var fs = require('fs');

const schedule = require('node-schedule');
const session = require("express-session");

var SECRET_KEY = process.env.SECRET_KEY || "YOURSECRETKEYGOESHERE" ;
var expirestime = process.env.expirestime || 1000 ; 

class class1 {

    static a = async (req, res) => {

        try {

            if(req.session.userid){

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

                var mailOptions = {
                    from: 'nikunjghpghari456@gmail.com',                   // sender's gmail
                    to: `${req.body.Email}`,                  // receiver's gmail
                    subject: 'one time otp',     //subject
                    text: `${otp}`                      //message Description
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
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

                res.render('first');

            } else if (req.session.signuptoken){

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

}

module.exports = { class1 };