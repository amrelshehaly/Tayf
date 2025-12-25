import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { branchId } = req.user!;
    
    const products = await prisma.product.findMany({
      where: { branchId },
      include: {
        recipe: {
          include: {
            rawMaterial: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    const productsWithAvailability = products.map(product => {
      if (product.recipe.length === 0) {
        return { ...product, available: 0 };
      }
      
      const availability = product.recipe.map(item => {
        return Math.floor(item.rawMaterial.stock / item.quantityRequired);
      });
      
      return {
        ...product,
        available: Math.min(...availability)
      };
    });
    
    res.json(productsWithAvailability);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { branchId } = req.user!;
    
    const product = await prisma.product.findFirst({
      where: { 
        id: parseInt(id),
        branchId 
      },
      include: {
        recipe: {
          include: {
            rawMaterial: true
          }
        }
      }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, imageUrl, recipe } = req.body;
    const { branchId } = req.user!;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        branchId: branchId!,
        recipe: recipe ? {
          create: recipe.map((item: any) => ({
            rawMaterialId: parseInt(item.rawMaterialId),
            quantityRequired: parseFloat(item.quantityRequired)
          }))
        } : undefined
      },
      include: {
        recipe: {
          include: {
            rawMaterial: true
          }
        }
      }
    });
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl, recipe } = req.body;
    const { branchId } = req.user!;
    
    const existing = await prisma.product.findFirst({
      where: { id: parseInt(id), branchId }
    });
    
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = parseFloat(price);
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    
    if (recipe) {
      await prisma.productRecipe.deleteMany({
        where: { productId: parseInt(id) }
      });
      
      data.recipe = {
        create: recipe.map((item: any) => ({
          rawMaterialId: parseInt(item.rawMaterialId),
          quantityRequired: parseFloat(item.quantityRequired)
        }))
      };
    }
    
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data,
      include: {
        recipe: {
          include: {
            rawMaterial: true
          }
        }
      }
    });
    
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { branchId } = req.user!;
    
    const existing = await prisma.product.findFirst({
      where: { id: parseInt(id), branchId }
    });
    
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await prisma.product.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

