import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {

  const hashedSuperAdminPassword = await bcrypt.hash('SuperAdmin123!', 12);
  
  await prisma.superAdmin.upsert({
    where: { email: 'superadmin@tayf.com' },
    update: {},
    create: {
      email: 'superadmin@tayf.com',
      password: hashedSuperAdminPassword,
      name: 'Super Admin',
      role: 'superadmin',
    },
  });


  const branch = await prisma.branch.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Downtown Branch',
    },
  });


  const hashedBranchAdminPassword = await bcrypt.hash('BranchAdmin123!', 12);
  
  await prisma.branchAdmin.upsert({
    where: { email: 'admin@downtown.tayf.com' },
    update: {},
    create: {
      email: 'admin@downtown.tayf.com',
      password: hashedBranchAdminPassword,
      name: 'Downtown Admin',
      role: 'branchadmin',
      branchId: branch.id,
    },
  });


  const flour = await prisma.rawMaterial.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Flour',
      stock: 5000,
      branchId: branch.id,
    },
  });

  const cheese = await prisma.rawMaterial.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Cheese',
      stock: 2000,
      branchId: branch.id,
    },
  });

  const tomatoSauce = await prisma.rawMaterial.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Tomato Sauce',
      stock: 3000,
      branchId: branch.id,
    },
  });

  const chicken = await prisma.rawMaterial.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'Chicken',
      stock: 1500,
      branchId: branch.id,
    },
  });


  const pizza = await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce and cheese',
      price: 12.99,
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
      branchId: branch.id,
    },
  });

  const pasta = await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Chicken Alfredo Pasta',
      description: 'Creamy pasta with grilled chicken',
      price: 15.99,
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9',
      branchId: branch.id,
    },
  });


  await prisma.productRecipe.upsert({
    where: { 
      productId_rawMaterialId: {
        productId: pizza.id,
        rawMaterialId: flour.id,
      }
    },
    update: {},
    create: {
      productId: pizza.id,
      rawMaterialId: flour.id,
      quantityRequired: 200,
    },
  });

  await prisma.productRecipe.upsert({
    where: { 
      productId_rawMaterialId: {
        productId: pizza.id,
        rawMaterialId: cheese.id,
      }
    },
    update: {},
    create: {
      productId: pizza.id,
      rawMaterialId: cheese.id,
      quantityRequired: 150,
    },
  });

  await prisma.productRecipe.upsert({
    where: { 
      productId_rawMaterialId: {
        productId: pizza.id,
        rawMaterialId: tomatoSauce.id,
      }
    },
    update: {},
    create: {
      productId: pizza.id,
      rawMaterialId: tomatoSauce.id,
      quantityRequired: 100,
    },
  });

  await prisma.productRecipe.upsert({
    where: { 
      productId_rawMaterialId: {
        productId: pasta.id,
        rawMaterialId: flour.id,
      }
    },
    update: {},
    create: {
      productId: pasta.id,
      rawMaterialId: flour.id,
      quantityRequired: 250,
    },
  });

  await prisma.productRecipe.upsert({
    where: { 
      productId_rawMaterialId: {
        productId: pasta.id,
        rawMaterialId: cheese.id,
      }
    },
    update: {},
    create: {
      productId: pasta.id,
      rawMaterialId: cheese.id,
      quantityRequired: 100,
    },
  });

  await prisma.productRecipe.upsert({
    where: { 
      productId_rawMaterialId: {
        productId: pasta.id,
        rawMaterialId: chicken.id,
      }
    },
    update: {},
    create: {
      productId: pasta.id,
      rawMaterialId: chicken.id,
      quantityRequired: 150,
    },
  });

  console.log('\nSeed completed successfully!\n');
  console.log('Test Credentials:');
  console.log('Super Admin: superadmin@tayf.com / SuperAdmin123!');
  console.log('Branch Admin: admin@downtown.tayf.com / BranchAdmin123!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

