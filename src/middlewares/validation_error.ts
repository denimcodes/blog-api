import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const validationError = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);
  
  if(!result.isEmpty()) {
    res.status(400).json({
      code: 'ValidationError',
      errors: result.array()
    });
    return;
  }
  
  next();
}

export default validationError;