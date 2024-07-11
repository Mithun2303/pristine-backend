
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../configs/db.config');
const crypto = require('crypto');
const { v4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

async function register(req, res, next) {
    const { name, email, password, dob, phonenumber } = req.body;
    if (!password) {
        res.status(400).json({ message: 'Password is required' })
        return;
    }
    try {
        console.log(email);
        console.log('Password:', password);
        //const usercheck = await pool.query('SELECT * FROM users WHERE email == $1',[email]);
        const usercheck = await pool.query("select * from users where email=$1", [email]);
        // console.log(usercheck);
        if (usercheck.rows.length > 0) {
            res.status(400).json({ message: 'User already exists' })
            return;
        }
        const userid = v4();
        const hashPass = await bcrypt.hash(password, 10);
        const token = jwt.sign({ userId: userid }, process.env.JWT_SECRET);
        const newuser = await pool.query(
            'INSERT INTO users (userid,name,email,passwords,dob,phonenumber,access_token) VALUES ($1,$2,$3,$4,$5,$6,$7)', 
            [userid, name, email, hashPass, dob, phonenumber,token]);
        res.status(201).json({ token })
        return;
    }
    catch (err) {
        res.status(500).json({ message: err })
        return;
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length == 0) {
            res.status(400).json({ message: 'User does not exist' });
            return;
        }
        const validPass = await bcrypt.compare(password, user.rows[0].passwords);
        if (!validPass) {
            res.status(400).json({ message: 'Invalid password' });
            return;
        }
        const token = jwt.sign({ userId: user.rows[0].userid }, JWT_SECRET, { expiresIn: '2h' });
        res.status(200).json({ token });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        return;
    }
}
async function forgot_password(req, res) {
    const { email } = req.body;
    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length == 0) {
        res.status(400).json({ message: 'User does not exist' });
        return;
    }
    else {
        const token = crypto.randomBytes(20).toString('hex');
        await db.query('UPDATE users SET resettoken = $1 WHERE email = $2', [token, email]);
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            port: 25,
            secure: false,
            logger: true,
            debug: true,
            secureConnection: false,
            auth: {
                user: process.env.MAIL_ID,
                pass: process.env.MAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            },
        });
        const options = {
            from: 'nandhithasakthivel7@gmail.com',
            to: email,
            subject: 'Password Reset',
            text: `Use this token to reset your password and link http://localhost:8000/reset-password/${token}`,
        };
        transporter.sendMail(options, (err, info) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error sending email');
                return;
            }
            console.log(info);
            res.status(200).jsonp('Check your email for instructions on resetting your password');
            return;
        })
    }
}

module.exports = { login, forgot_password, register };