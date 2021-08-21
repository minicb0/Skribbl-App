const express = require('express');
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
app.use(flash());
const PORT = 3000;
const words = ["cat", "dog", "television", "birds", "flag", "diamond", "computer", "mouse", "india", "earth", "pink", "chips"]

const io = require('socket.io')(5000)

// setting view engine
app.set('view engine', 'ejs');

// load assets
app.use('/public', express.static("public"))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'thisisasecret',
    saveUninitialized: false,
    resave: false
}));

app.get('/', (req, res) => {
    res.redirect('/login')
})

app.get('/login', (req, res) => {
    res.render('login', { message: req.flash('message') });
})

app.post('/login', (req, res) => {
    const { name } = req.body
    res.redirect('/game')
})

app.get('/game', (req, res) => {
    let word = words[Math.floor(Math.random()*words.length)].toUpperCase();
    req.flash('message', 'Your word is - ' + word)
    res.render('game', { word, message: req.flash('message') })
})

// chat - socket io
io.on('connection', socket => {
    socket.on('send-chat-message', async (message) => {
        socket.broadcast.emit('chat-message', { message: message })

    });

    socket.on('canvas', async (position) => {
        // console.log(position)
        socket.broadcast.emit('canvas-draw', { position: position })
    });
})

//Listening to port
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})