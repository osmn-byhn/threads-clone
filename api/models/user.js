const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    biography: {
        type: String
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/128/149/149071.png"
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