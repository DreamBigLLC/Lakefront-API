require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userAuth = require("./src/routes/userAuth");
const eventDetails = require("./src/routes/events");

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connect(
    'mongodb+srv://jdfraser22:' + 
    process.env.MONGO_ATLAS_PW + 
    '@lakefront.ngbmfkd.mongodb.net/'
    );
    
    app.use((req, res, next) => {
        // Restrict other webpages from using your own API (* allows all to reach your API)
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            );
            if (req.method === 'OPTIONS')
            {
                res.header("Access-Control-Allow-Origin", "*");
                res.header(
                    "Access-Control-Allow-Headers",
                    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
                    );
                res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
                return res.status(200).json({});
            }
            next();
        });
        
        app.use(cookieParser());
        
        app.use("/userAuth", userAuth);
        app.use("/events", eventDetails);

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})

app.listen(3000, () => console.log("Example app listening on port 3000!"));

module.exports = app;