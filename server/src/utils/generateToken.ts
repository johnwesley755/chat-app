import jwt from 'jsonwebtoken';

export const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET || 'secret';
  // Use @ts-ignore to bypass TypeScript type checking for this line
  // @ts-ignore
  return jwt.sign(
    { id },
    secret,
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};