const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

const corsOptions = {
    origin: 'http://localhost:8081'
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ expanded: true }));

const db = require('./models');
const dbConfig = require('./config/db.config');

db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
    })
    .then(() => {
        console.log("Successfully connected to MongoDB!");
        db.initial();
    })
    .catch(error => {
        console.error("Failure to connect to MongoDB", error);
        process.exit();
    });

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers',
        'Content-Type, Origin, Accept, x-access-token'
    );
    res.header('Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/test', userRoutes);


app.get('/', (req, res) => {
    res.json({ message: 'Welcome to bezkoder application' });
});

module.exports = app;

