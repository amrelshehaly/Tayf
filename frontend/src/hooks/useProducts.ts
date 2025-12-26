import { useEffect, useState } from 'react';
import api from '../api';
import { Product, CreateProductData, UpdateProductData } from '../types';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get<Product[]>('/products');
            setProducts(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const addProduct = async (product: CreateProductData) => {
        try {
            setLoading(true);
            setError(null);
            await api.post<Product>('/products', product);
            await getProducts();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async (id: number, product: UpdateProductData) => {
        try {
            setLoading(true);
            setError(null);
            await api.put<Product>(`/products/${id}`, product);
            await getProducts();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            await api.delete(`/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to delete product');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    return {
        products,
        loading,
        error,
        getProducts,
        addProduct,
        updateProduct,
        deleteProduct,
    };
};

export default useProducts;

