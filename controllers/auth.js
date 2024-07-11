const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../database')
const { v4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;


class Authentication {
    async register (req, res) {
        const { name, email, password, dob, phonenumber } = req.body;
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }
        try {
            console.log(email);
            console.log('Password:', password);
            //const usercheck = await pool.query('SELECT * FROM users WHERE email == $1',[email]);
            const usercheck = await pool.query("select * from users where email=$1", [email]);
            // console.log(usercheck);
            if (usercheck.rows.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const userid = v4();
            const hashPass = await bcrypt.hash(password, 10);
            const newuser = await pool.query('INSERT INTO users (userid,name,email,passwords,dob,phonenumber) VALUES ($1,$2,$3,$4,$5,$6)', [userid, name, email, hashPass, dob, phonenumber]);
            const token = jwt.sign({ userid: newuser.rows[0].userid }, process.env.JWT_SECRET);
            return res.status(201).json({ token });
        }
        catch (err) {
            res.status(500).json({ message: err });
            console.log(err.message);
            return;
        }
    }
    async login (req, res){
        const { email, password } = req.body;
        try {
            const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (user.rows.length == 0) {
                return res.status(400).json({ message: 'User does not exist' });
            }
            const validPass = await bcrypt.compare(password, user.rows[0].passwords);
            if (!validPass) {
                return res.status(400).json({ message: 'Invalid password' });
            }
            const token = jwt.sign({ userid: user.rows[0].userid }, JWT_SECRET, { expiresIn: '2h' });
            return res.status(200).json({ token });
        }
        catch (err) {
            res.status(500).json({ message: err.message });
            console.log(err.message);
            return;
        }
    }

}

module.exports = router;