const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:32
    },
    description:{
        type:String,
        required:true,
        maxlength:2000
    },
    price:{
        type:Number,
        trim:true,
        required:true,
        maxlength:32
    },
    category:{
        type:ObjectId,//when we refer to category the we need to go the category section section using its object id
        ref:'Category',
        required:true
    },
    quantity:{
        type:Number,
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    shipping:{
        required:false,
        type:Boolean
    }
},
{timestamps:true}
)



module.exports=mongoose.model("Product",productSchema)