import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminClient.js';
import GlassCard from '../../components/GlassCard.js';
import Button from '../../components/Button.js';
import Input from '../../components/Input.js';
import editIcon from '../../assets/edit.svg';
import trashIcon from '../../assets/trash.svg';

const BranchManagementPage: React.FC = () => {
    const [branches, setBranches] = useState<any[]>([]);
    const [newBranchName, setNewBranchName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchBranches = async () => {
        try {
            const { data } = await adminApi.getBranches();
            setBranches(data);
        } catch (error) {
            console.error('Failed to fetch branches:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const [isCreating, setIsCreating] = useState(false);
    const [editingBranch, setEditingBranch] = useState<any | null>(null);
    const [editName, setEditName] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBranchName.trim() || isCreating) return;

        setIsCreating(true);
        try {
            await adminApi.createBranch(newBranchName);
            setNewBranchName('');
            await fetchBranches();
            alert('Branch created successfully!');
        } catch (error: any) {
            console.error('Failed to create branch:', error);
            alert(`Failed to create branch: ${error.response?.data?.error || error.message}`);
        } finally {
            setIsCreating(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBranch || !editName.trim() || isUpdating) return;

        setIsUpdating(true);
        try {
            await adminApi.updateBranch(editingBranch.id, editName);
            setEditingBranch(null);
            setEditName('');
            await fetchBranches();
            alert('Branch updated successfully!');
        } catch (error: any) {
            console.error('Failed to update branch:', error);
            alert(`Failed to update branch: ${error.response?.data?.error || error.message}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete the branch "${name}"? This may affect courses assigned to this branch.`)) return;

        setIsDeleting(id);
        try {
            await adminApi.deleteBranch(id);
            await fetchBranches();
            alert('Branch deleted successfully!');
        } catch (error: any) {
            console.error('Failed to delete branch:', error);
            alert(`Failed to delete branch: ${error.response?.data?.error || error.message}`);
        } finally {
            setIsDeleting(null);
        }
    };

    if (isLoading) return <div className="p-8 text-white">Loading branches...</div>;

    return (
        <div className="p-8">
            <h1 className="gradient-text mb-8" style={{ fontSize: '2rem' }}>Branch Management</h1>

            <GlassCard className="mb-8 p-6">
                <h2 className="text-xl font-bold text-white mb-6">
                    {editingBranch ? 'Edit Branch' : 'Create New Branch'}
                </h2>
                <div className="flex flex-col gap-2 animate-fade-in text-white">
                    <label className="text-sm font-bold text-text-primary ml-1">
                        Branch Name
                    </label>
                    <form onSubmit={editingBranch ? handleUpdate : handleCreate} className="flex gap-4 items-center">
                        <div className="flex-1">
                            <Input
                                containerClassName="mb-0"
                                value={editingBranch ? editName : newBranchName}
                                onChange={(e) => editingBranch ? setEditName(e.target.value) : setNewBranchName(e.target.value)}
                                placeholder="e.g., Computer Science (CSE)"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="h-full px-8"
                            isLoading={editingBranch ? isUpdating : isCreating}
                        >
                            {editingBranch ? 'Update' : 'Create'}
                        </Button>
                        {editingBranch && (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    setEditingBranch(null);
                                    setEditName('');
                                }}
                            >
                                Cancel
                            </Button>
                        )}
                    </form>
                </div>
            </GlassCard>

            <GlassCard className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Existing Branches</h2>
                {branches.length === 0 ? (
                    <p className="text-text-secondary">No branches created yet.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {branches.map((branch) => (
                            <div
                                key={branch.id}
                                className="flex items-center justify-between p-5 bg-bg-card border border-white/10 rounded-lg font-medium shadow-sm hover:border-brand-primary/30 transition-colors group"
                                style={{ minHeight: '70px' }}
                            >
                                <span className="text-text-primary pl-8" style={{ fontSize: '14px', display: 'inline-block' }}>{branch.name}</span>
                                <div className="flex gap-4 pr-2">
                                    <button
                                        onClick={() => {
                                            setEditingBranch(branch);
                                            setEditName(branch.name);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="transition-transform hover:scale-110"
                                        title="Edit"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                                    >
                                        <img src={editIcon} alt="Edit" style={{ width: '22px', height: '22px' }} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(branch.id, branch.name)}
                                        disabled={isDeleting === branch.id}
                                        className="transition-transform hover:scale-110 disabled:opacity-50"
                                        title="Delete"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                                    >
                                        {isDeleting === branch.id ? (
                                            <div className="h-5 w-5 border-2 border-t-transparent border-rose-400 rounded-full animate-spin"></div>
                                        ) : (
                                            <img src={trashIcon} alt="Delete" style={{ width: '22px', height: '22px' }} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </GlassCard>

            <div className="mt-12 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-300">
                    <strong>Note:</strong> Branch names must exactly match what the frontend expect for filtering to work (e.g., "Civil Engineering").
                </p>
            </div>
        </div>
    );
};

export default BranchManagementPage;
