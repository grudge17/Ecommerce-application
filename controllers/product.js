const formidable=require('formidable')
const _=require('lodash')
const Product=require('../models/product')
const fs=require('fs')
const {errorHandler}=require('../helpers/dbErrorHandler')


exports.productById=(req,res,next,id)=>{
    Product.findById(id).exec((err,product)=>{
        if(err||!product){
            return res.status(400).json({
                error:"Product not Found!!"
            }) 
        }
        req.product=product
        next();
    })
}

exports.read=(req,res)=>{
    req.product.photo=undefined
    return res.json(req.product)
}



exports.create=(req,res)=>{
    let form =new formidable.IncomingForm()
    form.keepExtensions=true//for image extensions
    form.parse(req,(err,fields,files)=>{
              if(err){
                  return res.status(400).json({
                      error:"Image could not uploaded"
                  })
              }
             //check for all fields
             const{name,description,price,category,quantity,shipping}=fields
             if(!name || !description || !price || !category || !quantity || !shipping){
                return res.status(400).json({
                    error:"All fields are required!!"
                })  
             }



              let product=new Product(fields)
                //1kb=1000
                //1mb=1000000

              if(files.photo){
                  if(files.photo.size>1000000){
                    return res.status(400).json({
                        error:"Image should be less than 1MB is size"
                    })   
                  }
                  product.photo.data=fs.readFileSync(files.photo.path)
                  product.photo.contentType=files.photo.type
              }
              product.save((err,result)=>{
                  if(err){
                      return res.status(400).json({
                          error:errorHandler(err)
                      })
                  }
                  res.json(result)
              })
    })

}