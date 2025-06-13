const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requiredLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post");
const User = mongoose.model("User")

router.get('/profile/:id', requiredLogin, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const posts = await Post.find({ postedBy: req.params.id })
            .populate("postedBy", "_id name");

        res.json({ user, posts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.put('/follow', requiredLogin, async (req, res) => {
    try {
        const updatedFollowedUser = await User.findByIdAndUpdate(
            req.body.followId,
            { $addToSet: { followers: req.user._id } },
            { new: true }
        ).select("-password");

        const updatedFollowingUser = await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { following: req.body.followId } },
            { new: true }
        ).select("-password");

        res.json(updatedFollowingUser);
    } catch (err) {
        console.error(err);
        res.status(422).json({ error: err.message });
    }
});


router.put('/unfollow', requiredLogin, async (req, res) => {
    try {
        const updatedUnfollowedUser = await User.findByIdAndUpdate(
            req.body.unfollowId,
            { $pull: { followers: req.user._id } },
            { new: true }
        ).select("-password");

        const updatedFollowingUser = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { following: req.body.unfollowId } },
            { new: true }
        ).select("-password");

        res.json(updatedFollowingUser);
    } catch (err) {
        console.error(err);
        res.status(422).json({ error: err.message });
    }
});

router.get('/profile/:id/followers', requiredLogin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("followers", "_id name pic");
        res.json(user.followers);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

router.get('/profile/:id/following', requiredLogin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("following", "_id name pic");
        res.json(user.following);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

router.put('/updatepic', requiredLogin, async (req, res) => {
    try {
        if (!req.body.pic) {
            return res.status(422).json({ error: "Picture URL is required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { pic: req.body.pic } },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(updatedUser);
    } catch (err) {
        console.error("Error updating profile picture:", err);
        res.status(500).json({ error: "Failed to update profile picture" });
    }
});



module.exports = router;