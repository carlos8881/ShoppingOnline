// const db = require('../models/db');

// exports.register = (req, res) => {
//     const { account, password, phoneNumber, email } = req.body;
//     const query = 'INSERT INTO users (account, password, phone_number, email) VALUES (?, ?, ?, ?)';
//     db.query(query, [account, password, phoneNumber, email], (err, result) => {
//         if (err) {
//             console.error('Error inserting data:', err);
//             res.status(500).send('Error registering user');
//             return;
//         }
//         res.status(200).send('User registered successfully');
//     });
// };

// exports.login = (req, res) => {
//     const { account, password } = req.body;
//     const query = 'SELECT * FROM users WHERE account = ? AND password = ?';
//     db.query(query, [account, password], (err, results) => {
//         if (err) {
//             console.error('Error querying the database:', err);
//             res.status(500).send('Error logging in');
//             return;
//         }
//         if (results.length > 0) {
//             res.status(200).json({ message: 'Login successful', account });
//         } else {
//             res.status(401).send('Invalid account or password');
//         }
//     });
// };

// exports.googleLogin = (req, res) => {
//     const { account } = req.body;
//     const query = 'INSERT INTO users (account, auth_provider) VALUES (?, ?) ON DUPLICATE KEY UPDATE auth_provider = VALUES(auth_provider)';
//     db.query(query, [account, 'google'], (err, result) => {
//         if (err) {
//             console.error('Error inserting data:', err);
//             res.status(500).send('Error logging in with Google');
//             return;
//         }
//         res.status(200).send('Google login successful');
//     });
// };

const UserDAO = require('../models/userDAO');
const db = require('../models/db');
const userDAO = new UserDAO(db);

exports.register = (req, res) => {
    const { account, password, phoneNumber, email } = req.body;
    userDAO.createUser(account, password, phoneNumber, email, (err, result) => {
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
    userDAO.getUserByAccount(account, (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            res.status(500).send('Error logging in');
            return;
        }
        if (results.length > 0 && results[0].password === password) {
            res.status(200).json({ message: 'Login successful', account });
        } else {
            res.status(401).send('Invalid account or password');
        }
    });
};
