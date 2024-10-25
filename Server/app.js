// Polyfill fetch for Node.js v16
global.fetch = require('node-fetch');

// Polyfill ReadableStream for Node.js v16
global.ReadableStream = require('web-streams-polyfill').ReadableStream;

//local npm
const path = require('path');
const http = require('http');

//mongoDB connection
const connectDB = require('./util/dataBase');

//routes
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const songsRoutes = require('./routes/songs');
const socketRoutes = require('./routes/socket');

//socket
const socket = require('./util/socket');

//3rd npm's
const express = require('express');
const bodyParser = require('body-parser');

//session//
    //save a cookie in the user req.session
    const session = require('express-session');
    // save the session in the mongo database
    const MongoDBStore = require('connect-mongodb-session')(session);
    const store = new MongoDBStore({
        uri: 'mongodb+srv://server:Server1234@moveodatabase.x2lcn.mongodb.net/moveoDataBase?retryWrites=true&w=majority&appName=moveoDataBase',
        collection: 'sessions', 
    });


//cors is security for the server to avoid getting req from differents origins
const cors = require('cors');
const app = express();

//here we allow the origin of the req to be only from the front server
app.use(cors({
    origin: 'http://184.73.72.205:5000',
    credentials: true // This allows cookies and sessions to be sent
}));

//we create server and connect the socket
const server = http.createServer(app);
socket.connectWebSocket(server);


//! no needed for back server
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, '../Front/build')));
//?app.use(bodyParser.urlencoded({ extended: false }));

//convert jason data in the req body
app.use(bodyParser.json());

//setting up sessions
app.use(
    session({
    secret: 'my secret', //this is the key for the cookie
    resave: false, //don't save the session if nothing changed
    saveUninitialized: false, //don't save an empty value
    store: store, //save the session in the mongo database
    cookie:{
    maxAge: 1000 * 60 * 60 * 12}, //the cookie will be valid for 12 hours
    })
  );

//routes
app.use('/admin',adminRoutes);
app.use(authRoutes)
app.use(songsRoutes);
app.use(socketRoutes);

//if 404
app.use((req,res,next) => {res.status(404)});

connectDB.connectDB(() => {
    server.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});
