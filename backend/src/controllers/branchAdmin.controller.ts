import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/db';

export const getBranchAdmins = async (req: Request, res: Response) => {
  try {
    const { branchId } = req.query;
    
    const where = branchId ? { branchId: parseInt(branchId as string) } : {};
    
    const admins = await prisma.branchAdmin.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        branchId: true,
        createdAt: true,
        updatedAt: true,
        branch: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(admins);
  } catch (error) {
    console.error('Get branch admins error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createBranchAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password, branchId } = req.body;
    
    if (!name || !email || !password || !branchId) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const existing = await prisma.branchAdmin.findUnique({
      where: { email }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = await prisma.branchAdmin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        branchId: parseInt(branchId)
      },
      select:{
        id: true,
        name: true,
        email: true,
        role: true,
        branchId: true,
        createdAt: true,
        updatedAt: true,
        branch: {
          select: { id: true, name: true }
        }
      },
    });
    
    res.status(201).json(admin);
  } catch (error) {
    console.error('Create branch admin error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateBranchAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    
    const data: any = {};
    if (name) data.name = name;
    if (email) data.email = email;
    
    const admin = await prisma.branchAdmin.update({
      where: { id: parseInt(id) },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        branchId: true,
        createdAt: true,
        updatedAt: true,
        branch: {
          select: { id: true, name: true }
        }
      },
    });
    
    res.json(admin);
  } catch (error) {
    console.error('Update branch admin error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteBranchAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.branchAdmin.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Branch admin deleted successfully' });
  } catch (error) {
    console.error('Delete branch admin error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

