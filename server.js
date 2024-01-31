const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const authRouter = require('./routes/authRoutes');
require('dotenv').config()
app = express();
app.use(cors());
app.use(bodyparser.json());
mongoose.connect(process.env.MONGOBD_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB.')
}).catch(err => {
    console.log('Failed to connect to MongoDB.')
})

app.use('/auth', authRouter);
app.listen(process.env.PORT, () => {
    console.log(`Running on port ${process.env.PORT}`);
})