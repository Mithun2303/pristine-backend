
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../configs/db.config');
const crypto = require('crypto');
const { v4 } = require('uuid');
const dotenv = require('dotenv');
const { create_token } = require('../utils/jwt');
dotenv.config();


async function register(req, res, next) {
    const { name, email, password, dob, phonenumber } = req.body;
    if (!password || !email) {
        res.status(400).json({ message: 'Bad Request' })
        return;
    }
    try {
        const usercheck = await pool.query("select * from users where email=$1", [email]);
        if (usercheck.rows.length > 0) {
            res.status(302).json({ message: 'User already exists' })
            return;
        }
        const userid = v4();
        const hashPass = await bcrypt.hash(password, 10);
        const token = create_token({userId:userId})
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
        const user = await pool.query('SELECT userId FROM users WHERE email = $1', [email]);
        if (user.rows.length == 0) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const validPass = await bcrypt.compare(password, user.rows[0].passwords);
        if (!validPass) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = create_token({userId:user.rows[0].userId});
        // const token = jwt.sign({ userId: user.rows[0].userid }, JWT_SECRET, { expiresIn: '2h' });
        res.status(200).json({message: token });
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
        res.status(404).json({ message: 'User does not exist' });
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
            from: process.env.MAIL_ID,
            to: email,
            subject: 'Password Reset',
            text: `Use this token to reset your password and link http://localhost:3000/reset-password/${token}`,
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