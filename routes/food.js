const router = require("express").Router();
const {food,add_to_cart,remove_cart} = require("../controllers/food");
router.get("/details",food);
router.post("/add-to-cart",add_to_cart);
router.post("/remove-from-cart",remove_cart);
module.exports=router;
