const express=require('express')
const router=express.Router()

const {
    create,
    productById,
    read,
    remove,
    update,
    list,
    listRelated,
    listCategories,
    listBySearch,
    photo
}=require('../controllers/product')
const {requireSignin,isAuth,isAdmin}=require('../controllers/auth')
const {userById}=require('../controllers/user')

router.get('/product/:productId',read)
router.post("/product/create/:userId",requireSignin,isAuth,isAdmin,create)
router.delete('/product/:productId/:userId',requireSignin,isAuth,isAdmin,remove)
router.put('/product/:productId/:userId',requireSignin,isAuth,isAdmin,update)
router.get('/products',list)
router.get('/products/related/:productId',listRelated)
router.get('/products/categories',listCategories)
router.post('/products/by/search',listBySearch)//here we are using post as we need req.body to divide products by search
//so first we need to post that and after we'll get the req.body
router.get('/product/photo/:productId',photo)


router.param("userId",userById)//whenever we get user id as an parameter we should find that id and display all the details
//we do this to make particular user dashboard.
router.param("productId",productById)

module.exports=router;