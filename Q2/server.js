const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());
// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123123123',
    database: 'nodejs_demo'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Start the server
const PORT =  3000;   //environment variable that typically stores the port number on which the server should listen
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


//CRUD
//POST Method
app.post('/api/users', (req, res) => {
    const user = req.body;
    const sql = 'INSERT INTO users SET ?';
    db.query(sql, user, (err, result) => {
        if (err) throw err;
        res.send('User created');
    });
});


//GET Method
app.get('/api/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) throw err;   
        res.json(results);
    });
});

//GET Method by ID
app.get('/api/users/:email', (req, res) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [req.params.email], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error fetching user, error: err' })
        } else if (result.length === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json(result);
        }

    });
});

//PUT Method
app.put('/api/users/:email', (req, res) => {
    const sql = 'UPDATE users SET ? WHERE email = ?';
    db.query(sql, [req.body, req.params.email], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).json({ message: 'Failed to update user.', error: err });
            return;
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ message: 'User updated' });
    });
});

//DETELE Method
app.delete('/api/users/:email', (req, res) => {
    const sql = 'DELETE FROM users WHERE email = ?';
    db.query(sql, [req.params.email], (err, result) => {
        if (err) throw err;
        res.send('User deleted.');
    });
});