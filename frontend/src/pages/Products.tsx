import { useState } from 'react';
import BranchTable, { Column } from '../components/Table';
import BranchModal from '../components/Modal';
import useProducts from '../hooks/useProducts';
import useMaterials from '../hooks/useMaterials';
import { Product } from '../types';

interface RecipeItem {
    rawMaterialId: number;
    quantityRequired: number;
}

const Products = () => {
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();
    const { materials } = useMaterials();
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [imageUrl, setImageUrl] = useState('');
    const [recipe, setRecipe] = useState<RecipeItem[]>([]);


    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(undefined);
        setMode('create');
        setName('');
        setDescription('');
        setPrice(0);
        setImageUrl('');
        setRecipe([]);
    };

    const handleAddProduct = () => {
        setShowModal(true);
        setMode('create');
        setName('');
        setDescription('');
        setPrice(0);
        setImageUrl('');
        setRecipe([]);
    };

    const handleSubmit = async () => {
        if (!name.trim() || price <= 0) return;

        if (mode === 'create') {
            await addProduct({
                name: name.trim(),
                description: description.trim() || undefined,
                price: price,
                imageUrl: imageUrl.trim() || undefined,
                recipe: recipe.filter(r => r.rawMaterialId > 0 && r.quantityRequired > 0)
            });
        } else if (selectedProduct && mode === 'edit') {
            await updateProduct(selectedProduct.id, {
                name: name.trim(),
                description: description.trim() || undefined,
                price: price,
                imageUrl: imageUrl.trim() || undefined,
                recipe: recipe.filter(r => r.rawMaterialId > 0 && r.quantityRequired > 0)
            });
        }

        handleCloseModal();
    };

    const handleEdit = (id: number) => {
        const product = products.find(p => p.id === id);
        if (product) {
            setSelectedProduct(product);
            setName(product.name);
            setDescription(product.description || '');
            setPrice(product.price);
            setImageUrl(product.imageUrl || '');
            setRecipe(product.recipe.map(r => ({
                rawMaterialId: r.rawMaterialId,
                quantityRequired: r.quantityRequired
            })));
            setMode('edit');
            setShowModal(true);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    const productColumns: Column<Product>[] = [
        { header: 'Name', render: (p) => p.name },
        { header: 'Price', render: (p) => `$${p.price.toFixed(2)}` },
        { header: 'Recipe Items', render: (p) => p.recipe.length },
        { header: 'Available', render: (p) => p.available ?? 0 },
        { header: 'Created At', render: (p) => new Date(p.createdAt).toDateString() },
        {
            header: 'Actions',
            render: (p) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        style={{ width: '100px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                        className="secondary" 
                        onClick={() => handleEdit(p.id)}
                    >
                        Edit
                    </button>
                    <button 
                        style={{ width: '100px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                        className="contrast" 
                        onClick={() => handleDelete(p.id)}
                    >
                        Delete
                    </button>
                </div>
            )
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: '1rem' }}>
                <button onClick={handleAddProduct}>Add Product</button>
            </div>
            
            {showModal && (
                <BranchModal
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    buttonText={mode === 'create' ? 'Create Product' : 'Update Product'}
                    onSubmit={handleSubmit}
                    title={mode === 'create' ? 'Please enter the product details.' : 'Please update the product details.'}
                >
                    <label>
                        Product Name *
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                            placeholder="Product Name"
                            autoFocus
                            style={{ marginTop: '5px' }}
                        />
                    </label>
                    <label style={{ marginTop: '10px', display: 'block' }}>
                        Description
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description (optional)"
                            style={{ marginTop: '5px', width: '100%', minHeight: '80px' }}
                        />
                    </label>
                    <label style={{ marginTop: '10px', display: 'block' }}>
                        Price *
                        <input 
                            type="number" 
                            value={price} 
                            onChange={(e) => setPrice(Number(e.target.value))} 
                            required 
                            placeholder="Price"
                            style={{ marginTop: '5px' }}
                        />
                    </label>
                    <label style={{ marginTop: '10px', display: 'block' }}>
                        Image URL
                        <input 
                            type="url" 
                            value={imageUrl} 
                            onChange={(e) => setImageUrl(e.target.value)} 
                            placeholder="Image URL (optional)"
                            style={{ marginTop: '5px' }}
                        />
                    </label>

                    <hr style={{ marginTop: '20px' }} />
                    
                    <div style={{ marginTop: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <h6 style={{ margin: 0 }}>Recipe</h6>
                            <button 
                                type="button"
                                style={{ width: '200px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                onClick={() => setRecipe([...recipe, { rawMaterialId: 0, quantityRequired: 0 }])}
                                className="secondary"
                            >
                                + Add Ingredient
                            </button>
                        </div>

                        {recipe.length === 0 && (
                            <small style={{ color: '#666' }}>No ingredients added.</small>
                        )}

                        {recipe.map((item, index) => (
                            <div key={index} style={{ marginBottom: '15px', display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                                <label>
                                    Material
                                    <select
                                        value={item.rawMaterialId || ''}
                                        onChange={(e) => {
                                            const updated = [...recipe];
                                            updated[index].rawMaterialId = Number(e.target.value);
                                            setRecipe(updated);
                                        }}
                                    >
                                        <option value="">Select Material</option>
                                        {materials.map((material) => (
                                            <option key={material.id} value={material.id}>
                                                {material.name} (Stock: {material.stock})
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label style={{ marginTop: '10px', display: 'block' }}>
                                    Quantity
                                    <input
                                        type="number"
                                        value={item.quantityRequired || ''}
                                        onChange={(e) => {
                                            const updated = [...recipe];
                                            updated[index].quantityRequired = Number(e.target.value);
                                            setRecipe(updated);
                                        }}
                                        placeholder="Quantity Required"
                                        min="0"
                                        step="0.01"
                                    />
                                </label>
                                <button
                                    type="button"
                                    style={{ width: '100px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    onClick={() => setRecipe(recipe.filter((_, i) => i !== index))}
                                    className="contrast"
                                >
                                    Remove
                                </button>
                                {index < recipe.length - 1 && <hr style={{ margin: '15px 0' }} />}
                            </div>
                        ))}
                    </div>
                </BranchModal>
            )}
            
            <BranchTable 
                columns={productColumns} 
                data={products} 
                getRowKey={(p) => p.id}
            />
        </div>
    );
};

export default Products;

