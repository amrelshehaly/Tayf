import React, { useEffect, useState } from 'react'
import api from '../api';
import { BranchAdmin, CreateBranchAdminData, UpdateBranchAdminData } from '../types';

export const useBranchAdmins = () => {

    const [admins, setAdmins] = useState<BranchAdmin[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAdmins = async () => {
        setLoading(true);
        setError(null); 
        const response = await api.get('/branch-admins');
        setAdmins(response.data);
        setLoading(false);
    }
    
    const addAdmin = async (admin: CreateBranchAdminData) => {
        setLoading(true);
        setError(null);
        const response = await api.post('/branch-admins', admin);
        setAdmins([...admins, response.data]);
        setLoading(false);
    }

    const updateAdmin = async (id: number, admin: UpdateBranchAdminData) => {
        setLoading(true);
        setError(null);
        const response = await api.put(`/branch-admins/${id}`, admin);
        setAdmins(admins.map(a => a.id === id ? response.data : a));
        setLoading(false);
    }

    const deleteAdmin = async (id: number) => {
        setLoading(true);
        setError(null);
        const response = await api.delete(`/branch-admins/${id}`);
        setAdmins(admins.filter(a => a.id !== id));
        setLoading(false);
    }

    useEffect(() => {
        getAdmins();
    }, []);

    return {
        admins,
        loading,
        error,
        getAdmins,
        addAdmin,
        updateAdmin,
        deleteAdmin,
    }
}

export default useBranchAdmins;