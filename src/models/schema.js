'use strict';
    const mongoose = require("mongoose");
    var validator = require("validator")

    const Schema = mongoose.Schema;

    const TodoSchema = new Schema({
        username: {
            type: String,
            required: true,
            unique: [true]
        },
        password: {
            type: String,
            required: true
        },
        confirmpassword: {
            type: String,
            required: true
        },
        Email: {
            type: String,
            trim: true,
            required: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new error("Email is not valid");
                }
            }
        },
        createdAt:{type:Date},
        complete: {
            type: String
        },
        otp: {
            type: Number
        },
        signuptoken: {
            type: String
        },
       logintoken: {
            type: String
        },
        forgettimetoken: {
            type: String
        },
        userimg: {
            data: Buffer,
            contentType: String
        },
        Followers: {
            type: Array,
        },
        Following: {
            type: Array,
        },
        post :[ {
            data:Buffer,
            contentType:String,
            likes :Array,
            comments:Array
        }],
        Bio:{
            type: String
        }
        // ,
        // message:{
            
        // },
        // multilogout: {
        //     type: String
        // },
        // logout: {
        //     type: String
        // },
        
    });

    const TodoSchema2 = new Schema({
        username: {
            type: String,
            required: true,
            unique: [true],
            expires: new Date()
        }
        
    });

module.exports = mongoose.model("Nikxgramcollection", TodoSchema);

// var Todo1 = mongoose.model("Nikxgramcollection", TodoSchema);
// var Todo2 = mongoose.model("Nikxgramcollection2", TodoSchema2);

// module.exports =  {Todo1,Todo2};