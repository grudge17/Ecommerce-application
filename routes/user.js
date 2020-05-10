const express=require('express')
const router=express.Router()

const {userById}=require('../controllers/user')
const {requireSignin,isAuth,isAdmin}=require('../controllers/auth')

router.get('/secret/:userId',requireSignin,isAuth,isAdmin,(req,res)=>{
    res.json({
        user:req.profile
    })
})

router.param("userId",userById)//whenever we get user id as an parameter we should find that id and display all the details
//we do this to make particular user dashboard.


module.exports=router;