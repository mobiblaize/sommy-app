if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
    console.log('connected to database', 'mongodb://localhost:27017/sommy');
});

mongoose.connection.on('error', (err) => {
    console.log('Database error', err);
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3001;

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Cors middleware
app.use(cors());

//BodyParser middleware
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

//Client routes
app.use('/', require('./routes/user'));
//admin routes
app.use('/admins', require('./routes/admin'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

//Start server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})