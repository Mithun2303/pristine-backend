const db = require('../database');
const express = require('express');
const router = express.Router();
router.get('/details', (req, res) => {
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
    
  
});
module.exports = router;