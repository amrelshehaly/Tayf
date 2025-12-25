import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/db';
import { generateToken } from '../services/auth.service';


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    let user = await prisma.superAdmin.findUnique({ where: { email } });
    let role = 'superadmin';
    let branchId = null;

    if (!user) {
      const branchAdmin = await prisma.branchAdmin.findUnique({ where: { email } });
      if (!branchAdmin) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      user = branchAdmin;
      role = 'branchadmin';
      branchId = branchAdmin.branchId;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, role, user.email, user.name, branchId);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role,
        branchId
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.user!;

    if (role === 'superadmin') {
      const user = await prisma.superAdmin.findUnique({ 
        where: { id: userId },
        select: { id: true, email: true, name: true, role: true }
      });
      return res.json(user);
    } else {
      const user = await prisma.branchAdmin.findUnique({ 
        where: { id: userId },
        select: { id: true, email: true, name: true, role: true, branchId: true }
      });
      return res.json(user);
    }
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};