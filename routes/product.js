const express=require('express')
const router=express.Router()

const {create,productById,read}=require('../controllers/product')
const {requireSignin,isAuth,isAdmin}=require('../controllers/auth')
const {userById}=require('../controllers/user')

router.get('/product/:productId',read)
router.post("/product/create/:userId",requireSignin,isAuth,isAdmin,create)

router.param("userId",userById)//whenever we get user id as an parameter we should find that id and display all the details
//we do this to make particular user dashboard.
router.param("productId",productById)

module.exports=router;