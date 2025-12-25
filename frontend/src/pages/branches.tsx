import { useState } from 'react';
import BranchTable, { Column } from '../components/Table';
import BranchModal from '../components/Modal';
import useBranches from '../hooks/useBranches';
import { Branch } from '../types';



const AdminBranches = () => {
    const { branches, addBranch, deleteBranch, updateBranch } = useBranches();
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [selectedBranch, setSelectedBranch] = useState<Branch | undefined>(undefined);
    const [name, setName] = useState('');

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBranch(undefined);
        setMode('create');
        setName('');
    };

    const handleAddBranch = () => {
        setShowModal(true);
        setMode('create');
        setName('');
    };

    const handleSubmit = async () => {
        if (!name.trim()) return;

        if (mode === 'create') {
            await addBranch(name.trim());
        } else if (selectedBranch && mode === 'edit') {
            await updateBranch(selectedBranch.id, name.trim());
        }
        
        handleCloseModal();
    };

    const handleEdit = (id: number) => {
        const branch = branches.find(b => b.id === id);
        if (branch) {
            setSelectedBranch(branch);
            setName(branch.name);
            setMode('edit');
            setShowModal(true);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this branch?')) {
            deleteBranch(id);
        }
    };

    const branchColumns: Column<Branch>[] = [
        { header: 'Name', render: (b) => b.name },
        { header: 'Created At', render: (b) => b.createdAt },
        { header: 'Updated At', render: (b) => b.updatedAt },
        { header: 'Admins Count', render: (b) => b._count?.branchAdmins || 0 },
        {
            header: 'Actions',
            render: (b) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="secondary" onClick={() => handleEdit(b.id)}>
                        Edit
                    </button>
                    <button className="contrast" onClick={() => handleDelete(b.id)}>
                        Delete
                    </button>
                </div>
            )
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: '1rem' }}>
                <button onClick={handleAddBranch}>Add Branch</button>
            </div>
            
            {showModal && (
                <BranchModal
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    buttonText={mode === 'create' ? 'Create Branch' : 'Update Branch'}
                    onSubmit={handleSubmit}
                    title={mode === 'create' ? 'Please enter the name of the branch.' : 'Please update the name of the branch.'}
                >
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        placeholder="Branch Name"
                        autoFocus
                    />
                </BranchModal>
            )}
            
            <BranchTable 
                columns={branchColumns} 
                data={branches} 
                getRowKey={(b) => b.id}
            />
        </div>
    );
};

export default AdminBranches;