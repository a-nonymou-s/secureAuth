const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRouter = require('./routes/authRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB.');
    })
    .catch(err => {
        console.log(`Failed to connect to MongoDB. ${err}`);
    });

app.use('/auth', authRouter);
app.listen(process.env.PORT, () => {
    console.log(`Running on port ${process.env.PORT}`);
});
