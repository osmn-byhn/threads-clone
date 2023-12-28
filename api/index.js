const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const cors = require('cors')
const jwt = require('jsonwebtoken')


const app = express();
const port = 4000;
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());


mongoose.connect("mongodb+srv://osmanbeyhan605:sifre@cluster0.tc9q5sl.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() =>{
    console.log("Connected to Mongodb");
}).catch((err) => {
    console.log("Error Connecting to Mongodb");
})

app.listen(port, () => {
    console.log("server running on: ", port);
})