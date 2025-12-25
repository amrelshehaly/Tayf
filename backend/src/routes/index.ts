import { authMiddleware, isSuperAdmin, isBranchAdmin } from "../middleware/auth";
import { Router } from "express";
import { login, getMe } from '../controllers/auth.controller';
import { getBranches, getBranch, createBranch, updateBranch, deleteBranch } from '../controllers/branch.controller';
import { getMaterials, getMaterial, createMaterial, updateMaterial, deleteMaterial } from '../controllers/material.controller';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { getBranchAdmins, createBranchAdmin, updateBranchAdmin, deleteBranchAdmin } from '../controllers/branchAdmin.controller';
const router = Router();

// auth routes
router.post('/auth/login', login);
router.get('/auth/me', authMiddleware, getMe);

// Branches
router.get('/branches', authMiddleware, isSuperAdmin, getBranches);
router.get('/branches/:id', authMiddleware, isSuperAdmin, getBranch);
router.post('/branches', authMiddleware, isSuperAdmin, createBranch);
router.put('/branches/:id', authMiddleware, isSuperAdmin, updateBranch);
router.delete('/branches/:id', authMiddleware, isSuperAdmin, deleteBranch);

// Branch Admins
router.get('/branch-admins', authMiddleware, isSuperAdmin, getBranchAdmins);
router.post('/branch-admins', authMiddleware, isSuperAdmin, createBranchAdmin);
router.put('/branch-admins/:id', authMiddleware, isSuperAdmin, updateBranchAdmin);
router.delete('/branch-admins/:id', authMiddleware, isSuperAdmin, deleteBranchAdmin);

// Materials
router.get('/materials', authMiddleware, isBranchAdmin, getMaterials);
router.get('/materials/:id', authMiddleware, isBranchAdmin, getMaterial);
router.post('/materials', authMiddleware, isBranchAdmin, createMaterial);
router.put('/materials/:id', authMiddleware, isBranchAdmin, updateMaterial);
router.delete('/materials/:id', authMiddleware, isBranchAdmin, deleteMaterial);

// Products
router.get('/products', authMiddleware, isBranchAdmin, getProducts);
router.get('/products/:id', authMiddleware, isBranchAdmin, getProduct);
router.post('/products', authMiddleware, isBranchAdmin, createProduct);
router.put('/products/:id', authMiddleware, isBranchAdmin, updateProduct);
router.delete('/products/:id', authMiddleware, isBranchAdmin, deleteProduct);


export default router;