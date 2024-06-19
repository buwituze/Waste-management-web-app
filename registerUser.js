const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/Waste-management-web-app', { useNewUrlParser: true, useUnifiedTopology: true });

const username = 'admin';
const password = 'password';
const role = 'admin';

const user = new User({ username, password: bcrypt.hashSync(password, 10), role });

user.save()
    .then(() => {
        console.log('User registered');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error registering user', err);
        mongoose.connection.close();
    });
