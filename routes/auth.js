const router = require("express").Router();
const {register,login,forgot_password,reset_password} = require("../controllers/auth")

router.post("/register",register);
router.post("/login",login);
router.post("/forget-password",forgot_password);
router.post("/reset-password",reset_password);



module.exports=router;