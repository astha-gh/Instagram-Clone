const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requiredLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");

router.get('/allpost', requiredLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort('-createdAt')
        .then(posts => {
            res.json({ posts });
        })
        .catch(err => {
            console.error("Error fetching posts:", err);
            res.status(500).json({ error: "Something went wrong while fetching posts" });
        });
});

router.post('/createpost', requiredLogin, (req, res) => {
    const { title, body, photo } = req.body
    if (!title || !body || !photo) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        photo,
        postedBy: req.user,
    })
    post.save().then(result => {
        res.json({ post: result })
    })
        .catch(err => {
            console.log(err);
        })
})

router.get('/mypost', requiredLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .sort('-createdAt')
        .then(mypost => {
            res.json({ mypost })
        })
        .catch(err => {
            console.log(err);
        })
})

router.put('/like', requiredLogin, async (req, res) => {
    try {
        console.log("Incoming like request:", req.body);

        const result = await Post.findByIdAndUpdate(
            req.body.postId,
            {
                $push: { likes: req.user._id }
            },
            { new: true }
        );

        res.json(result);
    } catch (err) {
        console.error("Error in /like:", err);
        res.status(422).json({ error: err.message });
    }
});

router.put('/unlike', requiredLogin, async (req, res) => {
    try {
        const result = await Post.findByIdAndUpdate(
            req.body.postId,
            {
                $pull: { likes: req.user._id }
            },
            { new: true }
        );

        res.json(result);
    } catch (err) {
        console.error("Error in /unlike:", err);
        res.status(422).json({ error: err.message });
    }
});

router.put('/comment', requiredLogin, async (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    };

    try {
        const result = await Post.findByIdAndUpdate(
            req.body.postId,
            {
                $push: { comments: comment }
            },
            { new: true }
        )
            .populate("comments.postedBy", "_id name")
            .populate("postedBy", "_id name");

        res.json(result);
    } catch (err) {
        console.error("Error in /comment:", err);
        res.status(422).json({ error: err.message });
    }
});

router.delete('/deletepost/:postId', requiredLogin, async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.postId })
            .populate("postedBy", "_id");

        if (!post) {
            return res.status(422).json({ error: "Post not found" });
        }

        if (post.postedBy._id.toString() === req.user._id.toString()) {
            await post.deleteOne();
            return res.json({ message: "Successfully deleted" });
        } else {
            return res.status(403).json({ error: "You are not authorized to delete this post" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.put('/deletecomment', requiredLogin, async (req, res) => {
    const { postId, commentId } = req.body;
    Post.findByIdAndUpdate(
        postId, {
        $pull: { comments: { _id: commentId } }
    },
        {
            new: true
        }
    )
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            return res.status(422).json({ error: err });
        })
});

router.get('/getsubpost', requiredLogin, (req, res) => {
    Post.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt")
        .then(posts => {
            res.json({ posts });
        })
        .catch(err => {
            console.error("Error fetching posts:", err);
            res.status(500).json({ error: "Something went wrong while fetching posts" });
        });
});

module.exports = router;