const express = require('express');
const bodyParser = require('body-parser');
const exerciseRoutes = require('./routes/exercise.routes.js');
const userRoutes = require('./routes/user.routes.js');
const authRoutes = require('./routes/auth.routes');
const db = require('./models');
const cors = require('cors');
require('dotenv').config();

const app = express();

const corsOptions = { origin: "http://localhost:3000" };

const uri = process.env.ATLAS_URI; 

//app.use(cors(cors(corsOptions)));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

db.mongoose.connect(uri, 
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const connection = db.mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
    db.initial();
});
    

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "http://localhost:3000");
    res.header('Access-Control-Allow-Headers', 
        'Accept, Origin, Content, X-Requested-With, Content-Type, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/exercises', exerciseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/test', userRoutes);

app.use('/api', (req, res) => {
    res.status(200).send("Welcome to Exercise Tracker application!");
});

module.exports = app;