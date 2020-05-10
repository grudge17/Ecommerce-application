const User=require('../models/user')

exports.userById=(req,res,next,id)=>{
User.findById(id).exec((err,user)=>{
  if(err || !user){
      return res.status(400).json({
          error:'User not Found!!'
      })
  }  
  req.profile=user
  next();//as the upper is a middleware that is next is used to move ahead
})
}