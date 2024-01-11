const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const path = require('path');
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to Mongodb");
}).catch((err) => {
  console.log("Error Connecting to Mongodb: ", err);
})
app.listen(process.env.PORT, () => {
  console.log("server running on: ", process.env.PORT);
})
const User = require("./models/user")
const Post = require("./models/post")
const secretKey = "secretKey"
app.post("/register", async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" })
    }
    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      return res.status(400).json({ message: "Username already registered" })
    }
    
    const newUser = new User({ fullName, username, email, password });
    console.log("username: ", newUser);
    newUser.verificationToken = crypto.randomBytes(20).toString("hex")
    await newUser.save();
    sendVerificationEmail(newUser.email, newUser.verificationToken)
    res.status(200).json({ message: "Registeration successful, please check your email for vertification" })
  } catch (error) {
    console.log("error registering user", error);
    res.status(500).json({ message: "error registering user" })
  }
})


app.put("/edit-profile/:userId", async (req, res) => {
  try {
    const { fullName, username, password, biography, profilePicture } = req.body;
    const userId = req.params.userId;
    const decodedUserId = jwt.verify(userId, secretKey);
    const updatedUser = await User.findByIdAndUpdate(
      decodedUserId.userId,
      {
        fullName,
        username,
        password,
        biography,
        profilePicture
      }
    );

    if (username) {
      const existingUsername = await User.findOne({ username, _id: { $ne: decodedUserId.userId } });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already registered" });
      }
    }

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.log("Error updating profile:", error);
    res.status(500).json({ message: "An error occurred while updating the profile" });
  }
});

const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: "threads.com",
    to: email,
    subject: "Email Verification",
    text: `Please click the following link to verify your email http://localhost:${process.env.PORT}/verify/${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("error sending email", error);
  }
};

app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid token" })
    }

    user.verified = true;
    user.verificationToken = undefined
    await user.save()

    res.status(200).json({ message: "Email verified successfully" })
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Email vertification failed" })
  }
})

app.post("/login", async(req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email: email});
    if (!user) {
      return res.status(404).json({message: "Invalid email"})
    }
    if (user.password !== password) {
      return res.status(404).json({message: "Invalid password"})
    }
    const token = jwt.sign({userId: user._id}, secretKey)
    res.status(200).json({token})
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Error while login post"})
  }
})



app.get("/user/:userId", (req, res) => {
  try {
    const loggedInUserId = req.params.userId;

    // Token'ı decode et
    jwt.verify(loggedInUserId, secretKey, (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: "Invalid token" });
      }

      // Token içindeki kullanıcı ID'sini al
      const userId = decoded.userId;

      // MongoDB sorgusu
      User.find({  _id: { $ne: userId }  })
        .then((users) => {
          console.log(users);
          res.status(200).json(users);
        })
        .catch((error) => {
          console.log("Error: ", error);
          res.status(500).json("error");
        });
    });
  } catch (error) {
    res.status(500).json({ message: "error getting the users" });
  }
});


app.post("/follow", async (req, res) => {
  try {
    const { currentUserId, selectedUserId } = req.body;
    // Verify both currentUserId and selectedUserId are JWTs
    const decodedCurrentUserId = jwt.verify(currentUserId, secretKey);

    
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { followers: decodedCurrentUserId.userId },
    });
    console.log("current: ", decodedCurrentUserId);
    console.log("selected: ", selectedUserId);
    
    console.log("Okey man");
    res.sendStatus(200)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in following a user" });
  }
});



app.post("/users/unfollow", async (req, res) => {
  try {
    const { loggedInUserId, targetUserId } = req.body;
    const decodedLoggedInUserId = jwt.verify(loggedInUserId, secretKey);
    console.log("current: ", decodedLoggedInUserId.userId);
    console.log("selected: ", targetUserId);
    const userToUpdate = await User.findOne({
      _id: targetUserId,
      followers: decodedLoggedInUserId.userId,
    });

    if (userToUpdate) {
      await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: decodedLoggedInUserId.userId },
      });

      console.log("Okey man");
      res.sendStatus(200);
    } else {
      res.status(400).json({ message: "User is not following the target user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in unfollowing a user" });
  }
});

app.post("/create-post", async(req, res) => {
  try {
    const {content, userId} = req.body;
    const decodedUserId = jwt.verify(userId, secretKey);
    const newPostData = {
      user: decodedUserId.userId,
    }
    console.log(decodedUserId.userId);
    if (content) {
      newPostData.content = content;
    }
    const newPost = new Post(newPostData)
    await newPost.save();
    res.status(200).json({message: "Post saved successfully"})
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "post creation failed"})
  }
})


app.put("/posts/:postId/:userId/like", async(req, res) => {
  try {
    const postId = req.params.postId
    const userId = req.params.userId
    const decodedUserId = jwt.verify(userId, secretKey);
    const post = await Post.findById(postId).populate("user", "fullName username profilePicture")
    const updatedPost = await Post.findByIdAndUpdate( 
      postId,
      {$addToSet: {likes: decodedUserId.userId}},
      {new: true}
    )

    updatedPost.user = post.user;

    if(!updatedPost) {
      return res.status(404).json({message: "post not found"})
    }
    res.json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "an error occurred while liking"})
  }
})


app.put("/posts/:postId/:userId/unlike", async(req, res) => {
  try {
    const postId = req.params.postId
    const userId = req.params.userId
    const decodedUserId = jwt.verify(userId, secretKey);
    const post = await Post.findById(postId).populate("user", "fullName username profilePicture")
    const updatedPost = await Post.findByIdAndUpdate( 
      postId,
      {$pull: {likes: decodedUserId.userId}},
      {new: true}
    )

    updatedPost.user = post.user;

    if(!updatedPost) {
      return res.status(404).json({message: "post not found"})
    }
    res.json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "an error occurred while liking"})
  }
})


app.get("/get-posts", async(req, res) => {
  try {
    const posts = await Post.find().populate("user", "fullName username profilePicture").sort({createdAt: -1});
    res.status(200).json(posts)
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "An error occurred while getting the posts"})
  }
})

app.get("/decode/:userId", async(req, res) => {
  try {
    const userId = req.params.userId
    const decodedUserId = jwt.verify(userId, secretKey);
    res.status(200).json(decodedUserId.userId)
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "An error occurred while decoding token to id"})
  }
})


app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const decodedUserId = await jwt.verify(userId, secretKey);
    const user = await User.findById(decodedUserId.userId);


    console.log("user: ",user);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while getting user" });
  }
});

app.get("/posts/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const decodedUserId = await jwt.verify(userId, secretKey);
    const posts = await Post.find({user: decodedUserId.userId}).populate("user", "fullName username profilePicture").sort({createdAt: -1})
    console.log(posts);
    res.status(200).json(posts)
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while getting posts" });
  }
})

app.post("/post-replies/:postId/:userId", async (req, res) => {
  try {
    const postId = req.params.postId
    const decodedUserId = await jwt.verify(req.params.userId, secretKey);
    const content = req.body;
    const post = await Post.findById(postId).populate("user", "fullName username profilePicture")
    const updatedPost = await Post.findByIdAndUpdate( 
      postId,
      {$addToSet: {replies: content}},
      {new: true}
    )
    updatedPost.user = post.user;
    console.log("successfully reply");
    if(!updatedPost) {
      return res.status(404).json({message: "post not found"})
    }
    res.json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "an error occurred while repling"})
  }
})