import { Request, Response, NextFunction } from 'express';

export const validateParamsCustomerId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { customer_id } = req.params;
  
  if (!customer_id) {
    res.status(400).json({ error: 'O id do usuário não pode estar em branco' 
    });
    return;
  }
  next();
};