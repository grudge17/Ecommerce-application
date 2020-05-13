const express=require('express')
const router=express.Router()

const {userById,read,update}=require('../controllers/user')
const {requireSignin,isAuth,isAdmin}=require('../controllers/auth')

router.get('/secret/:userId',requireSignin,isAuth,isAdmin,(req,res)=>{
    res.json({
        user:req.profile
    })
})

router.get('/user/:userId',requireSignin,isAuth,read)
router.put('/user/:userId',requireSignin,isAuth,update)//update user id


router.param("userId",userById)//whenever we get user id as an parameter we should find that id and display all the details
//we do this to make particular user dashboard.


module.exports=router;