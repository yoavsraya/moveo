// Polyfill fetch for Node.js v16
global.fetch = require('node-fetch');

// Polyfill ReadableStream for Node.js v16
global.ReadableStream = require('web-streams-polyfill').ReadableStream;
//local npm
const path = require('path');
const http = require('http');

//files import
const connectDB = require('./util/dataBase');
const user = require('./models/user');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const songsRoutes = require('./routes/songs');
const socketRoutes = require('./routes/socket');
const socket = require('./util/socket');
//3rd npm's
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors');

const app = express();
const server = http.createServer(app);
socket.connectWebSocket(server);

const store = new MongoDBStore({
    uri: 'mongodb+srv://server:Server1234@moveodatabase.x2lcn.mongodb.net/moveoDataBase?retryWrites=true&w=majority&appName=moveoDataBase',
    collection: 'sessions', 
});
//listen in 5000
app.use(cors({
    origin: 'http://184.73.72.205:5000', // Replace with your frontend URL
    credentials: true // This allows cookies and sessions to be sent
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../Front/build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
    session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie:{
    maxAge: 1000 * 60 * 60 * 12},
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
