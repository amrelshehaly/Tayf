import jwt from 'jsonwebtoken';

export const generateToken = (userId: number, role: string, email: string, name: string, branchId?: number | null) => {
  return jwt.sign(
    { userId, role, branchId, email, name },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
};