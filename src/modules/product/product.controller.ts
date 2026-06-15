// create product

import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";


const createProduct=catchAsync(async(req:Request,res:Response)=>{
    console.log(req.body)
})


const productController = {
    createProduct
}

export default productController;