const db = require("../configs/db.config");
const express = require('express');
const router = express.Router();

async function food (req,res){
    try{
        db.query('SELECT * FROM food',(err,result) => {
        if(err){
                res.status(500).json({message:err});
                console.log(err.message);
                return;
            }
            res.status(200).json(result.rows);
            //console.log(result.rows[0].name);
        })
        }
    
        catch(err){ 
            res.status(500).json({message:err});
            console.log(err.message );
            return;
        }
        
}
async function add_to_cart(req,res){
    // try{
    //     db.query('INSERT INTO cart(count,foodId,userId) VALUES($1,$2,$3)',[req.body.count,req.body.food_id,req.body.user_id],(err,result) => {
    //         if(err){
    //             res.status(500).json({message:err});
    //             console.log(err.message);
    //             return;
    //         }
    //         res.status(200).json(result.rows);
    //         //console.log(result.rows[0].name);
    //     })
    //     }

    //     catch(err){
    //         res.status(500).json({message:err});
    //         console.log(err.message );
    //         return;
    // }
    try {
        const { food_id, count,user_id } = req.body;
        

        const user = await db.query('SELECT * FROM cart WHERE userId = $1 AND foodId = $2', [user_id, food_id]);

        if (user.rows.length > 0) {
            await db.query('UPDATE cart SET count = count + $1 WHERE userId = $2 AND foodId = $3', [count, user_id, food_id]);
        } else {
            await db.query('INSERT INTO cart (userId, foodId, count) VALUES ($1, $2, $3)', [user_id, food_id, count]);
        }

        res.status(200).json({ message: 'Item added to cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function remove_cart(req,res){
 const { food_id, user_id } = req.body;
    try {
        await db.query('DELETE FROM cart WHERE userId = $1 AND foodId = $2', [user_id, food_id]);
        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports = {food,add_to_cart,remove_cart};