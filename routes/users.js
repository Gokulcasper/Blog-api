const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require('bcrypt');


//UPDATE
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        try {

            const updatedUser = await User.findByIdAndUpdate(
                //     req.params.id,
                //     {
                //         $set: req.body,
                //     },
                //     { upsert: true }
                // );
                { _id: req.params.id },
                {
                    $set: {
                        username: req.body.username,
                        email: req.body.email,
                        password: req.body.password,
                        profilePic: req.body.profilePic
                    },

                },
                { upsert: true, new: true }
            )

            res.status(200).json(updatedUser);

        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(401).json("You Can Update Only Your Account!")
    }
});

//DELETE 
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            try {
                await Post.deleteMany({ username: user.username });
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("User Has Been Deleted Successfully...");
            } catch (err) {
                res.status(500).json(err);
            }
        } catch (error) {
            res.status(404).json("user not found!")
        }
    } else {
        res.status(401).json("You Can delete Only Your Account!")
    }
});

//GET USER
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;