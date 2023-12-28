const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

const app = express();
dotenv.config();
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() =>{
    console.log("Connected to Mongodb");
}).catch((err) => {
    console.log("Error Connecting to Mongodb");
})

app.listen(process.env.PORT, () => {
    console.log("server running on: ", process.env.PORT);
})

const User = require("./models/user")
const Post = require("./models/post")

app.post("/register", async(req, res) => {
    try {
        const {fullName, email, password} = req.body;
        const existingUser = await User.findOne({email})
        if(existingUser) {
            return res.status(400).json({message: "Email already registered"})
        }
        const newUser = new User({fullName, email, password});
        newUser.verificationToken = crypto.randomBytes(20).toString("hex")
        await newUser.save();
        sendVerificationEmail(newUser.email, newUser.verificationToken)
        res.status(200).json({message: "Registeration successful, please check your email for vertification"})
    } catch (error) {
        console.log("error registering user", error);
        res.status(500).json({message: "error registering user"})
    }
})

const sendVerificationEmail = async (email, verificationToken) => {  
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: 'osmanbeyhan605@gmail.com',
        pass: 'bagp jsgn tero ujus', // Replace with your generated App Password
      },
    });
  
    const mailOptions = {
      from: "threads.com",
      to: email,
      subject: "Email Verification",
      text: `Please click the following link to verify your email http://localhost:2020/verify/${verificationToken}`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.log("error sending email", error);
    }
  };
  