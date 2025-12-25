import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const getBranches = async (req: Request, res: Response) => {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
       _count:{
          select: { branchAdmins: true }
       }
      }
    });
    res.json(branches);
  } catch (error) {
    console.error('Get branches error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getBranch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const branch = await prisma.branch.findUnique({
      where: { id: parseInt(id) },
      include: {
        branchAdmins: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    
    res.json(branch);
  } catch (error) {
    console.error('Get branch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createBranch = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Branch name is required' });
    }
    
    const branch = await prisma.branch.create({
      data: { name }
    });
    
    res.status(201).json(branch);
  } catch (error) {
    console.error('Create branch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateBranch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Branch name is required' });
    }
    
    const branch = await prisma.branch.update({
      where: { id: parseInt(id) },
      data: { name }
    });
    
    res.json(branch);
  } catch (error) {
    console.error('Update branch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteBranch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.branch.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    console.error('Delete branch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

