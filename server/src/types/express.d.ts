import { Express } from 'express-serve-static-core';
import { IUser } from '../models/userModel';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}