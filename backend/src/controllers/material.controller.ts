import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const getMaterials = async (req: Request, res: Response) => {
  try {
    const { branchId } = req.user!;
    
    const materials = await prisma.rawMaterial.findMany({
      where: { branchId },
      orderBy: { name: 'asc' }
    });
    
    res.json(materials);
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { branchId } = req.user!;
    
    const material = await prisma.rawMaterial.findFirst({
      where: { 
        id: parseInt(id),
        branchId 
      }
    });
    
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    res.json(material);
  } catch (error) {
    console.error('Get material error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createMaterial = async (req: Request, res: Response) => {
  try {
    const { name, stock } = req.body;
    const { branchId } = req.user!;
    
    if (!name) {
      return res.status(400).json({ error: 'Material name is required' });
    }
    
    const material = await prisma.rawMaterial.create({
      data: {
        name,
        stock: stock || 0,
        branchId: branchId!,
      }
    });
    
    res.status(201).json(material);
  } catch (error) {
    console.error('Create material error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, stock } = req.body;
    const { branchId } = req.user!;
    
    const existing = await prisma.rawMaterial.findFirst({
      where: { id: parseInt(id), branchId }
    });
    
    if (!existing) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (stock !== undefined) data.stock = stock;
    
    const material = await prisma.rawMaterial.update({
      where: { id: parseInt(id) },
      data
    });
    
    res.json(material);
  } catch (error) {
    console.error('Update material error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { branchId } = req.user!;
    
    const existing = await prisma.rawMaterial.findFirst({
      where: { id: parseInt(id), branchId }
    });
    
    if (!existing) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    await prisma.rawMaterial.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

