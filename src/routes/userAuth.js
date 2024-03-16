const express = require("express");
const router = express.Router();
require("dotenv").config();
const Users = require("../models/user");
const Token = require("../models/token");
const ejs = require("ejs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// var nodemailer = require("nodemailer");
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_APIKEY});

const {createTokens, validateToken } = require('../utils/JWT');

// Register User
router.post("/register", (req, res) => {

    // Define variables from req body
    let { name, email, phone, password, confirmPassword, userType, id } = req.body;
    name = name;
    email = email;
    phone = phone;
    password = password;
    confirmPassword = confirmPassword;
    userType = userType;

    // Check for empty fields
    if (name == "" || email == "" || phone == "" || password == "" || confirmPassword == "") {
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
        Users.find({email}).then(result => {
            if(result.length) {
                res.json({
                    status: "FAILED",
                    message: "User with the provided email already exists"
                })
            }
            else
            {
                const token = jwt.sign({ name, email, phone, password, userType, id }, process.env.JWT_SECRET, {expiresIn: "10m",});

                mg.messages.create("sandboxaa3174bcc6c5447c8d16b0a474a41c1a.mailgun.org", {
                    from: "Lakefront Admin <lakefrontadmin@lakefront.com>",
                    to: `${email}`,
                    subject: "Verify your Lakefront Email",
                    html: `
                        <h2>Click on the link below to activate your account</h2>
                        <p>${process.env.CLIENT_URL}/userAuth/email-verification/:${token}</p>`
                })
                .then(msg => console.log(msg))
                .catch(err => console.log(err));
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
router.post("/login", async (req, res) => {

    // Define variables from req body
    let { email, password} = req.body;
    email = email;
    password = password;

    // Check for empty fields
    if (email == "" || password == "") {
        res.status(400).json({
            message: "Empty Input Fields"
        });
    }
    else
    {
        // Check if user exists
        Users.find({email})
        .then(data => {
            if (data.length) {

                const user = Users.findOne( { email: email} );

                // Unhash password and compare against user data for login
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if (result) {

                        // Generate access token for user
                        const accessToken = createTokens(user)

                        // Access Token expiry of 30 days (calculation represented in miliseconds)
                        res.cookie("access-token", accessToken, {
                            maxAge: 60*60*24*30*1000,
                        });

                        res.json(
                            {
                                id: data[0]._id,
                                email: email,
                                userType: data[0].userType,
                                accessToken: accessToken
                            }
                        )
                    }
                    else
                    {
                        res.status(400).json({
                            message: "Sign-in unsuccessful"
                        });
                    }
                })
                .catch(err => {
                    res.status(400).json({
                        status: "FAILED",
                        message: "Failed to compare passwords"
                    });
                })

            }
            else
            {
                res.status(400).json({
                    message: "Invalid Credentials"
                });
            }
        })
        .catch(err => {
            res.status(404).json({
                message: "An error occured while checking for an existing user"
            });
        })
    }
});

// verify email
router.post("/email-verification/:token", (req, res) => {
    const {token} = req.params;
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, function(err, decodedToken) {
            if(err) {
                return res.status(400).json({error: 'Incorrect or expired link.'})
            }
            const {name, email, phone, password, userType, id} = decodedToken;

            Users.find({email}).then(result => {
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

                        const newUser = new Users({
                            name,
                            email,
                            phone,
                            password: hashedPassword,
                            userType: userType,
                            id
                        });
                        // add new user to database
                        newUser.save().then(result => {
                            res.json(
                                {
                                    name: result.name,
                                    id: result._id,
                                    email: result.email,
                                    phone: result.phone,
                                    userType: result.userType,
                                }
                            )
                        });
                    })
                }
            })
        })
    }
    else {
        return res.json({error: "Something went wrong"})
    }
})

// return user
router.get("/user", validateToken, (req, res) => {
    const {email} = req.body;

    const user = Users.findOne( { accessToken: res.cookie.accessToken } );
    res.json(user);
})

// Forgot Password
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    
    try {
        const existingUser = await Users.findOne({ email });
        if(!existingUser)
        {
            return res.send("User does not exist");
        }
        const secret = process.env.JWT_SECRET + existingUser.password;
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, secret, {expiresIn: "10m",});
        // const resetUrl = `http://localhost:3000/userAuth/reset-password/${existingUser._id}/${token}`;
        console.log(resetUrl);

        mg.messages.create("sandboxaa3174bcc6c5447c8d16b0a474a41c1a.mailgun.org", {
            from: "Lakefront Admin <lakefrontadmin@lakefront.com>",
            to: `${email}`,
            subject: "Reset your Password",
            html: `
                <h2>Click on the link below to reset your password</h2>
                <p>${process.env.CLIENT_URL}/userAuth/reset-password/${existingUser._id}/:${token}</p>`
        })
        .then(msg => console.log(msg))
        .catch(err => console.log(err));
    }
    catch (error) {
        res.status(400).json({
            message: `Failed to generate user verification ${error}`,
        })
    }
})

// Review user Id and Token for password reset
router.get("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;

    const existingUser = await Users.findOne({ _id: id });
        if(!existingUser)
        {
            return res.send("User does not exist");
        }
    // set secret for user
    const secret = process.env.JWT_SECRET + existingUser.password;
    try{
        // verify user
        const verify = jwt.verify(token, secret);
        ejs.render("index", { email: verify.email });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Failed to verify user"
        })
    }
})

// Patch call to update database with new password
router.patch("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    // find existing user in database
    const existingUser = await Users.findOne({ _id: id });
        if(!existingUser)
        {
            return res.send("User does not exist");
        }
    const secret = process.env.JWT_SECRET + existingUser.password;

    try{
        const verify = jwt.verify(token, secret);

        // Updated password handling
        const saltRounds = 10;
        const encryptedPassword = await bcrypt.hash(password, saltRounds);
        await Users.updateOne(
            {
                _id: id,
            },
            {
                $set: {
                    password: encryptedPassword,
                },
            }
        );
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Failed to verify user"
        })
    }
})

module.exports = router;
