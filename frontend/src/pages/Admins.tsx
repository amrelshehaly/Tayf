import { useState } from 'react';
import BranchTable, { Column } from '../components/Table';
import BranchModal from '../components/Modal';
import useBranchAdmins from '../hooks/useAdmins';
import { BranchAdmin } from '../types';
import useBranches from '../hooks/useBranches';

const Admins = () => {
    const { admins, addAdmin, updateAdmin, deleteAdmin } = useBranchAdmins();
    const { branches, loading: branchesLoading } = useBranches();
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [selectedAdmin, setSelectedAdmin] = useState<BranchAdmin | undefined>(undefined);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [branchId, setBranchId] = useState<number>(0);

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAdmin(undefined);
        setMode('create');
        setName('');
        setEmail('');
        setPassword('');
        setBranchId(0);
    };

    const handleAddAdmin = () => {
        setShowModal(true);
        setMode('create');
        setSelectedAdmin(undefined);
        setName('');
        setEmail('');
        setPassword('');
        setBranchId(0);
    };

    const handleSubmit = async () => {
        if (!name.trim() || !email.trim()) return;
        
        if (mode === 'create') {
            if (!password.trim() || !branchId) return;
            await addAdmin({ 
                name: name.trim(), 
                email: email.trim(),
                password: password.trim(),
                branchId: branchId
            });
        } else if (selectedAdmin && mode === 'edit') {
            await updateAdmin(selectedAdmin.id, { 
                name: name.trim(), 
                email: email.trim() 
            });
        }
        
        handleCloseModal();
    };

    const handleEdit = (id: number) => {
        const admin = admins.find(a => a.id === id);
        if (admin) {
            setSelectedAdmin(admin);
            setName(admin.name);
            setEmail(admin.email);
            setMode('edit');
            setShowModal(true);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this admin?')) {
            deleteAdmin(id);
        }
    };

    const adminColumns: Column<BranchAdmin>[] = [
        { header: 'Name', render: (a) => a.name },
        { header: 'Email', render: (a) => a.email },
        { header: 'Branch', render: (a) => a.branch?.name || `Branch ${a.branchId}` },
        { header: 'Created At', render: (a) => new Date(a.createdAt).toDateString() },
        { header: 'Updated At', render: (a) => new Date(a.updatedAt).toDateString() },
        {
            header: 'Actions',
            render: (a) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{ width: '100px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="secondary" onClick={() => handleEdit(a.id)}>
                        Edit
                    </button>
                    <button style={{ width: '100px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="contrast" onClick={() => handleDelete(a.id)}>
                        Delete
                    </button>
                </div>
            )
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: '1rem' }}>
                <button onClick={handleAddAdmin}>Add Admin</button>
            </div>
            
            {showModal && (
                <BranchModal
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    buttonText={mode === 'create' ? 'Create Admin' : 'Update Admin'}
                    onSubmit={handleSubmit}
                    title={mode === 'create' ? 'Please enter the admin details.' : 'Please update the admin details.'}
                >
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        placeholder="Admin Name"
                        autoFocus
                    />
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        placeholder="Email"
                        style={{ marginTop: '10px' }}
                    />
                    {mode === 'create' && (
                        <>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                placeholder="Password"
                                style={{ marginTop: '10px' }}
                            />
                            <select
                                value={branchId || ''}
                                onChange={(e) => setBranchId(Number(e.target.value))}
                                required
                                style={{ marginTop: '10px', width: '100%', padding: '8px' }}
                                disabled={branchesLoading}
                            >
                                <option value="">Select a Branch</option>
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                </BranchModal>
            )}
            
            <BranchTable 
                columns={adminColumns} 
                data={admins} 
                getRowKey={(a) => a.id}
            />
        </div>
    );
};

export default Admins;