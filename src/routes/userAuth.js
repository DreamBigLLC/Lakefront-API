const {User} = require("../models/user");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

// Register User
router.post("/register", (req, res) => {

    // Define variables from req body
    let { email, phone, password, confirmPassword, id } = req.body;
    email = email;
    phone = phone;
    password = password;
    confirmPassword = confirmPassword;

    // Check for empty fields
    if (email == "" || phone == "" || password == "" || confirmPassword == "") {
      res.json({
          status: "FAILED",
          message: "Empty Input Fields"
      });
    }
    // Check validity of email
    else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
    {
        res.json({
            status: "FAILED",
            message: "Invalid email formatting"
        });
    }
    else
    {
        // If email already is in registered table, don't add
        User.find({email}).then(result => {
            if(result.length) {
                res.json({
                    status: "FAILED",
                    message: "User with the provided email already exists"
                })
            }
            else
            {
                // password handling
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {

                    const newUser = new User({
                        email,
                        phone,
                        password: hashedPassword,
                        id
                    });
                    
                    // add new user to database
                    newUser.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "Signup successful, user added",
                            data: result
                        })
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occured while saving user data " +err+ " "
                        })
                    })
                })
                .catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occured while hashing password " + err + " "
                    })
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "Error occurred when checking for existing user"
            })
        });
    }
});

// login
router.post("/login", (req, res) => {

    // Define variables from req body
    let { email, password} = req.body;
    email = email;
    password = password;

    // Check for empty fields
    if (email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Empty Input Fields"
        });
    }
    else
    {
        // Check if user exists
        User.find({email})
        .then(data => {
            if (data.length) {

                // Unhash password and compare against user data for login
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if (result) {
                        res.json({
                            status: "SUCCESS",
                            message: "Sign-in successful",
                            data: data
                        })
                    }
                    else
                    {
                        res.json({
                            status: "FAILED",
                            message: "Sign-in unsuccessful"
                        });
                    }
                })
                .catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "Failed to compare passwords"
                    });
                })

            }
            else
            {
                res.json({
                    status: "FAILED",
                    message: "Invalid Credentials"
                });
            }
        })
        .catch(err => {
            res.json({
                status: "FAILED",
                message: "An error occured while checking for an existing user"
            });
        })


    }

});

// forgot


module.exports = router;
