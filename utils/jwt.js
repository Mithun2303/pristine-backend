const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verify_token = (token) =>{;
    try {
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
        return decoded_token
    } catch (error) {
        return error.message
    }
}

const create_token = (payload) =>{
    const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"2h"});
    return token;
}

module.exports={create_token,verify_token}