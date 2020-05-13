const User=require('../models/user')

exports.userById=(req,res,next,id)=>{
User.findById(id).exec((err,user)=>{
  if(err || !user){
      return res.status(400).json({
          error:'User not Found!!'
      })
  }  
  req.profile=user
  next();//as the upper is a middleware that is why next is used to move ahead
})
}

exports.read=(req,res)=>{
req.profile.hashed_password=undefined
req.profile.salt=undefined
return res.json(req.profile)
}

exports.update=(req,res)=>{//Issues a mongodb findAndModify update command
User.findOneAndUpdate(
     {_id:req.profile._id},
     {$set:req.body},//$set updates the fields from the user req.body
     {new:true},//new---the newly update fields are sent to the frontend as a json response
     (err,user)=>{
       if(err){
       return res.status(400).json({
         error:"You are not authorized to perform this action"
       })
     }
     user.hashed_password=undefined
     user.salt=undefined
     res.json(user)
}
)
}