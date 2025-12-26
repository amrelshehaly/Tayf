import { useEffect, useState } from 'react';
import api from '../api';
import { RawMaterial, CreateMaterialData, UpdateMaterialData } from '../types';

export const useMaterials = () => {
    const [materials, setMaterials] = useState<RawMaterial[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getMaterials = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get<RawMaterial[]>('/materials');
            setMaterials(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch materials');
        } finally {
            setLoading(false);
        }
    };

    const addMaterial = async (material: CreateMaterialData) => {
        try {
            setLoading(true);
            setError(null);
            await api.post<RawMaterial>('/materials', material);
            await getMaterials(); 
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to add material');
        } finally {
            setLoading(false);
        }
    };

    const updateMaterial = async (id: number, material: UpdateMaterialData) => {
        try {
            setLoading(true);
            setError(null);
            await api.put<RawMaterial>(`/materials/${id}`, material);
            await getMaterials();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to update material');
        } finally {
            setLoading(false);
        }
    };

    const deleteMaterial = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            await api.delete(`/materials/${id}`);
            setMaterials(materials.filter(m => m.id !== id));
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to delete material');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMaterials();
    }, []);

    return {
        materials,
        loading,
        error,
        getMaterials,
        addMaterial,
        updateMaterial,
        deleteMaterial,
    };
};

export default useMaterials;
