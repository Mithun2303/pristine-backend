/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - finished
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The title of your book
 *         author:
 *           type: string
 *           description: The book author
 *         finished:
 *           type: boolean
 *           description: Whether you have finished reading the book
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 *         finished: false
 *         createdAt: 2020-03-10T04:05:06.157Z
 */

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 *
 */
const db = require('../database');
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const nodemailer = require('nodemailer');
router.post('/',async(req,res)=>{
    const {email} = req.body;
    const user = await db.query('SELECT * FROM users WHERE email = $1',[email]);
    if(user.rows.length == 0){
        return res.status(400).json({message:'User does not exist'});
    } 
    else{
        const token = crypto.randomBytes(20).toString('hex');
        await db.query('UPDATE users SET resettoken = $1 WHERE email = $2', [token, email]);
        const transporter = nodemailer.createTransport ({
            host:'smtp.gmail.com',
            service:'gmail',
            port:25,
            secure:false,
            logger:true,
            debug:true,
            secureConnection:false,
            auth:{
                user:'22pt19@psgtech.ac.in',
                pass:'aswanth2905'
            },
            tls:{
                rejectUnauthorized:false
            },
        });
        const options = {
            from:'nandhithasakthivel7@gmail.com',
            to : email,
            subject:'Password Reset',
            text:`Use this token to reset your password and link http://localhost:8000/reset-password/${token}`,
        };
        transporter.sendMail(options, (err,info) => {
            if(err){
                console.log(err);
                res.status(500).send('Error sending email');
                return;
            }
            console.log(info);
            res.status(200).send('Check your email for instructions on resetting your password');
        });
    // async function main(){
    //     const info = await transporter.sendMail({
    //         from:'nandhithasakthivel7@gmail.com',
    //         to : email,
    //         subject:'Password Reset',
    //         text:`Use this token to reset your password and link http://localhost:8000/reset-password/${token}`,
    //     });
    //     console.log(info);
    // }
    // main().catch(console.error);

}
});
module.exports = router;