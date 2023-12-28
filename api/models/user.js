const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    sentFollowRequest: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: "User"
        }
    ],
    receviedFollowRequest: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: "User"
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: "User"
        }
    ],
    verified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
})


const User = mongoose.model("User", userSchema);

module.exports = User;