//local npm
const path = require('path');

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
socket.connectWebSocket();

const store = new MongoDBStore({
    uri: 'mongodb+srv://server:Server1234@moveodatabase.x2lcn.mongodb.net/moveoDataBase?retryWrites=true&w=majority&appName=moveoDataBase',
    collection: 'sessions', 
});

//
app.use(cors({
    origin: 'http://localhost:5001', // Replace with your frontend URL
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
    app.listen(3000); 
});
