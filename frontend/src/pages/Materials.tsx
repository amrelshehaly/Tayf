import { useState } from 'react';
import BranchTable, { Column } from '../components/Table';
import BranchModal from '../components/Modal';
import useMaterials from '../hooks/useMaterials';
import { RawMaterial } from '../types';

const Materials = () => {
    const { materials, addMaterial, updateMaterial, deleteMaterial } = useMaterials();
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | undefined>(undefined);
    const [name, setName] = useState('');
    const [stock, setStock] = useState<number>(0);

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMaterial(undefined);
        setMode('create');
        setName('');
        setStock(0);
    };

    const handleAddMaterial = () => {
        setShowModal(true);
        setMode('create');
        setName('');
        setStock(0);
    };

    const handleSubmit = async () => {
        if (!name.trim()) return;

        if (mode === 'create') {
            await addMaterial({
                name: name.trim(),
                stock: stock
            });
        } else if (selectedMaterial && mode === 'edit') {
            await updateMaterial(selectedMaterial.id, {
                name: name.trim(),
                stock: stock
            });
        }

        handleCloseModal();
    };

    const handleEdit = (id: number) => {
        const material = materials.find(m => m.id === id);
        if (material) {
            setSelectedMaterial(material);
            setName(material.name);
            setStock(material.stock);
            setMode('edit');
            setShowModal(true);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this material?')) {
            deleteMaterial(id);
        }
    };

    const materialColumns: Column<RawMaterial>[] = [
        { header: 'Name', render: (m) => m.name },
        { header: 'Stock', render: (m) => m.stock },
        { header: 'Created At', render: (m) => new Date(m.createdAt).toDateString() },
        { header: 'Updated At', render: (m) => new Date(m.updatedAt).toDateString() },
        {
            header: 'Actions',
            render: (m) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        style={{ width: '100px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                        className="secondary" 
                        onClick={() => handleEdit(m.id)}
                    >
                        Edit
                    </button>
                    <button 
                        style={{ width: '100px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                        className="contrast" 
                        onClick={() => handleDelete(m.id)}
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
                <button onClick={handleAddMaterial}>Add Material</button>
            </div>
            
            {showModal && (
                <BranchModal
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    buttonText={mode === 'create' ? 'Create Material' : 'Update Material'}
                    onSubmit={handleSubmit}
                    title={mode === 'create' ? 'Please enter the material details.' : 'Please update the material details.'}
                >
                    <label>
                        Material Name *
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                            placeholder="Material Name"
                            autoFocus
                            style={{ marginTop: '5px' }}
                        />
                    </label>
                    <label style={{ marginTop: '10px', display: 'block' }}>
                        Stock *
                        <input 
                            type="number" 
                            value={stock} 
                            onChange={(e) => setStock(Number(e.target.value))} 
                            required 
                            placeholder="Stock"
                            min="0"
                            style={{ marginTop: '5px' }}
                        />
                    </label>
                </BranchModal>
            )}
            
            <BranchTable 
                columns={materialColumns} 
                data={materials} 
                getRowKey={(m) => m.id}
            />
        </div>
    );
};

export default Materials;