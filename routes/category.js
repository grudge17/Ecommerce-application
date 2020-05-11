const express=require('express')
const router=express.Router()

const {create,categoryById,read,update,remove,list}=require('../controllers/category')
const {requireSignin,isAuth,isAdmin}=require('../controllers/auth')
const {userById}=require('../controllers/user')

router.get('/category/:categoryId',read)
router.post("/category/create/:userId",requireSignin,isAuth,isAdmin,create)
router.put("/category/:categoryId/:userId",requireSignin,isAuth,isAdmin,update)
router.delete("/category/:categoryId/:userId",requireSignin,isAuth,isAdmin,remove)
router.get('/categories',list)

router.param('categoryId',categoryById)
router.param("userId",userById)//whenever we get user id as an parameter we should find that id and display all the details
//we do this to make particular user dashboard.
module.exports=router;