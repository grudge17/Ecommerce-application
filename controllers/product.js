const formidable=require('formidable')
const _=require('lodash')
const Product=require('../models/product')
const fs=require('fs')
const {errorHandler}=require('../helpers/dbErrorHandler')


exports.productById=(req,res,next,id)=>{
    Product.findById(id).exec((err,product)=>{//any time when there product id param we get the req.body of product
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

exports.remove=(req,res)=>{
let product =req.product
product.remove((err,deletedProduct)=>{
    if(err){
        return res.status(400).json({
            error:errorHandler(err)
        })
}
res.json({
    message:"Product deleted successfully!!"
})
})
}

exports.update=(req,res)=>{
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



              let product=req.product
              product=_.extend(product,fields)//function is used for updating products using the lodash module

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


/**
 * Filter products possibilites
 * By sell/arrival
 * by sell=/products?sortBy=sold&orderBy=desc&limit=4
 * by product=/products?sortBy=createdAt&orderBy=desc&limit=4
 * if no params are sent.then all the products are returned
 */

 exports.list=(req,res)=>{
     let order =req.query.orderBy ? req.query.orderBy : 'asc'
     let sortBy=req.query.sortBy ? req.query.sortBy : '_id'
     let limit=req.query.limit ? parseInt(req.query.limit) : 6 // we need to parse it to INT 

     Product.find()
            .select("-photo")//we are deselecting photo as it is a large string so sending it will make the process
            .populate('category')//slow so we will make another req for photo ,to make it faster
            .sort([[sortBy,order]])
            .limit(limit)
            .exec((err,products)=>{
                if(err){
                    return res.status(400).json({
                        error:'Products not Found!!'
                    })
                }
                res.json(products)
            })
 }
/**
 * it will find the products based on the req product category
 * other products that has the same category,will be returned
 */
exports.listRelated=(req,res)=>{
    let limit =req.query.limit ? parseInt(req.query.limit) : 6

    Product.find({_id:{$ne:req.product},category:req.product.category})//here we will list all the related products except the requested product
           .limit(limit)//which will be inthe middle for which we have used $ne-->not including
           .populate('category','_id name')
           .exec((err,products)=>{
               if(err){
                   return res.status(400).json({
                       error:'Products not Found!!'
                   })
               }
               res.json(products)
           })
}
exports.listCategories=(req,res)=>{
    Product.distinct("category",{},(err,categories)=>{//mongoDb function used to find distinct product//second param is for query
           if(err){                                   //but at this time we have no use of sending queries
                return res.status(400).json({
                    error:"Categories not Found!!"
                })
           }                                          
            res.json(categories)
    })
}
/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch=(req,res)=>{
 let order=req.body.order ? req.body.order : "desc";
 let sortBy=req.body.sortBy ? req.body.sortBy : "_id";
 let limit=req.body.limit ? req.body.limit : 100;

 //skip--we have load more button at the base,so for ex we show 6 or 10 products but if they want to view more 
 //products they can
 let skip=parseInt(req.body.skip)

 //findArgs is empty as of now but it will contain queries once requested by the user and will populate in this object
 let findArgs={}

//First we will grab req.body and then will find the key
for(let key in req.body.filters){
    if(req.body.filters[key].length>0){//if length of key is zero no need to move forward
         if(key==="price"){ //if key=price then format->[0-10]
            // gte -  greater than price [0-10]
            // lte - less than
            findArgs[key]={
                $gte:req.body.filters[0],//[0] means price->[2,5] then filters[0] means 2
                $lte:req.body.filters[1]//[1] means price->[2,5] then filters[1] means 5
            }
         }
         else{
             findArgs[key]=req.body.filters[key];
         }
    }
}
//now we will perform the search based on the arguments
Product.find(findArgs)
       .select("-photo")//we are deselecting photo as it is a large string so sending it will make the process
       .populate('category')//slow so we will make another req for photo ,to make it faster
       .sort([[sortBy,order]])
       .skip(skip)
       .limit(limit)
       .exec((err,data)=>{
           if(err){
               return res.status(400).json({
                   error:"Products not Found!!"
               })
           }
           res.json({
               size:data.length,
               data
           })
       })
}

exports.photo=(req,res,next)=>{
    if(req.product.photo.data){
        res.set('Content-Type',req.product.photo.contentType)//we will save any image type ex:-jpeg,png etc
        return res.send(req.product.photo.data)
    }
    next()
}