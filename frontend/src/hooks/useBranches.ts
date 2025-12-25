import { useEffect, useState } from "react";
import { Branch } from "../types";
import api from "../api";

const useAdminBranches = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getBranches = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await api.get<Branch[]>('/branches'); 
          const branches = response.data.map(b => ({
            ...b,
            createdAt: new Date(b.createdAt).toDateString(),
            updatedAt: new Date(b.updatedAt).toDateString(),
          }));
          setBranches(branches);
        } catch (err: any) {
          setError(err.response?.data?.error || 'Failed to fetch branches');
        } finally {
          setLoading(false);
        }
      };

    const addBranch = async (branchName: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post<Branch>('/branches', {
                name: branchName
            });
            setBranches([...branches, response.data]);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to add branch');
        } finally {
            setLoading(false);
        }
    }

    const updateBranch = async (branchId: number, branchName: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.put<Branch>(`/branches/${branchId}`, {
                name: branchName
            });
            setBranches(branches.map(b => b.id === branchId ? response.data : b));
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to update branch');
        } finally {
            setLoading(false);
        }
    }

    const deleteBranch = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.delete<Branch>(`/branches/${id}`);
            setBranches(branches.filter(b => b.id !== id));
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to delete branch');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getBranches();
    },[]);


    return { branches, loading, error, addBranch, updateBranch, deleteBranch };
}

export default useAdminBranches

