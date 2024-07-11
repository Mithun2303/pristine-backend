const dotenv = require("dotenv");
const db = require("../configs/db.config")
const { create_token, verify_token } = require("../utils/jwt");
dotenv.config();

const middleware = (req, res, next) => {
    try {
        let token = req.get("authorization");
        if (!token) {
            return res.status(404).json({ success: false, msg: "Token not found" });
        }
        else {
            token = token.split(" ")[1];
            const decoded = verify_token(token);
            if (decoded == "jwt has expired") {
                return res.status(400).json({ msg: "jwt has expired", logout: true })
            }
            req.userId = decoded.userId;
            next();
        }
    } catch (error) {

    }
}

module.exports = middleware