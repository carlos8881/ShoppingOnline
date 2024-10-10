const db = require('../models/db');
const AuthService = require('../services/authService');
const authService = new AuthService(db);

exports.register = (req, res) => {
    const { account, password, phoneNumber, email } = req.body;
    authService.register(account, password, phoneNumber, email, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error registering user');
            return;
        }
        res.status(200).send('User registered successfully');
    });
};

exports.login = (req, res) => {
    const { account, password } = req.body;
    authService.login(account, password, (err, result) => {
        if (err) {
            console.error('Error querying the database:', err);
            res.status(500).send('Error logging in');
            return;
        }
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(401).send('Invalid account or password');
        }
    });
};

exports.googleLogin = (req, res) => {
    const { account } = req.body;
    authService.googleLogin(account, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error logging in with Google');
            return;
        }
        res.status(200).send('Google login successful');
    });
};