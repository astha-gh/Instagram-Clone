console.log("🚀 App.js has loaded");

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 4444;
const { MONGOURI, JWT_SECRET } = require('./config/keys')
const path = require('path');
const cors = require("cors");

app.use(cors({
    origin: process.env.CLIENT_URL || 'https://instaclone202.netlify.app',
    credentials: true
}));




mongoose.connect(MONGOURI);
mongoose.connection.on('connected', () => {
    console.log("Connected to MongoDB");
})
mongoose.connection.on('error', (err) => {
    console.log("Error in connection", err);
})

require('./models/user');
require('./models/post')

app.use(express.json());

app.use((req, res, next) => {
    console.log(`Incoming: ${req.method} ${req.path}`);
    next();
})

app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/user', require('./routes/user'));


app.get('/', (req, res) => {
    console.log("Home");
    res.send("Hello Instagram");
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server Error');
});


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});