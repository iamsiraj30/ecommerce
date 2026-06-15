import { Request, Response, NextFunction } from "express"; "express"

const catchAsync = (fn:any) => {
  return (req:Request, res:Response, next:NextFunction) => {
    fn(req, res, next).catch(next);  
  };
};
export default catchAsync;
