const  express = require("express");
const  app = express();

require("./db/conn");
const router = require('./routes/routers');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const sessions = require('express-session');
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

var path = require("path");

// app.use(express.static('public'))
app.use(express.static(path.join(__dirname,'../public')));
var ejs = require("ejs");
var ejs_folder_path = path.join(__dirname, "../templates");
app.set("view engine", "ejs");
app.set("views", ejs_folder_path);

var multer = require("multer");

require('dotenv').config();

const  port = process.env.PORT || 4000;

app.use('/', router);

app.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});