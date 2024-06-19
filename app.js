const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/Waste-management-web-app', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));

// Passport configuration
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) return done(err);
            if (!user) return done(null, false, { message: 'Incorrect username.' });
            if (!user.comparePassword(password)) return done(null, false, { message: 'Incorrect password.' });
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

// Protected route to get user role
app.get('/api/getUserRole', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ role: req.user.role });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

app.get('/', (req, res) => {
    res.send('Home Page');
});

app.get('/login', (req, res) => {
    res.send(`
        <form method="post" action="/login">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required><br><br>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required><br><br>
            <button type="submit">Log In</button>
        </form>
    `);
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
