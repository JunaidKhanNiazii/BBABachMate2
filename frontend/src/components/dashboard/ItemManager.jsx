import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

// Generic CRUD Manager for Dashboard Items
function ItemManager({ title, endpoint, fields }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');

    const fetchItems = async () => {
        try {
            setLoading(true);
            const res = await api.get(endpoint);
            if (res.data.success) {
                setItems(res.data.data);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load records.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [endpoint]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });
            if (selectedFile) {
                submitData.append('image', selectedFile);
            }

            await api.post(endpoint, submitData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setShowForm(false);
            setFormData({});
            setSelectedFile(null);
            setImagePreview(null);
            fetchItems();
        } catch (err) {
            console.error(err);
            alert('Operation failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        try {
            await api.delete(`${endpoint}/${id}`);
            fetchItems();
        } catch (err) {
            console.error(err);
            alert('Failed to delete record.');
        }
    };

    return (
        <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-6 md:p-8 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-2xl font-black text-[var(--accent-primary)] tracking-tight uppercase">{title}</h2>
                    <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest mt-1">Management Console</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${showForm
                        ? 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                        : 'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-secondary)] shadow-lg'
                        }`}
                >
                    {showForm ? 'Cancel' : 'Add New Entry'}
                </button>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-bold uppercase tracking-widest">
                    {error}
                </div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-12 p-8 border border-[var(--bg-tertiary)] rounded-2xl bg-[var(--bg-primary)] shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {fields.map((field) => (
                            <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-3 ml-1">{field.label}</label>
                                {field.type === 'file' ? (
                                    <div className="relative">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border border-[var(--bg-tertiary)] border-dashed rounded-xl cursor-pointer bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]/30 transition-all">
                                            <div className="text-center">
                                                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Upload Asset</p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                        {imagePreview && (
                                            <div className="mt-4 flex justify-center">
                                                <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-[var(--bg-tertiary)]" />
                                            </div>
                                        )}
                                    </div>
                                ) : field.type === 'select' ? (
                                    <select
                                        name={field.name}
                                        required={field.required}
                                        onChange={handleInputChange}
                                        className="w-full p-4 bg-[var(--bg-primary)] border border-[var(--bg-tertiary)] rounded-xl text-[var(--text-primary)] text-xs font-medium focus:border-[var(--accent-secondary)] focus:outline-none transition-all appearance-none uppercase tracking-wide"
                                    >
                                        <option value="">SELECT {field.label.toUpperCase()}</option>
                                        {field.options?.map(opt => (
                                            <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                                        ))}
                                    </select>
                                ) : field.type === 'multiselect' ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            name={field.name}
                                            required={field.required}
                                            onChange={handleInputChange}
                                            placeholder={`ENTER ${field.label.toUpperCase()} (COMMA SEPARATED)`}
                                            className="w-full p-4 bg-[var(--bg-primary)] border border-[var(--bg-tertiary)] rounded-xl text-[var(--text-primary)] text-xs font-medium focus:border-[var(--accent-secondary)] focus:outline-none transition-all placeholder:text-[var(--text-secondary)]/30 uppercase tracking-wide"
                                        />
                                        <p className="text-[8px] text-[var(--text-secondary)] font-bold uppercase tracking-widest ml-2">Separate items with commas</p>
                                    </div>
                                ) : field.type === 'textarea' ? (
                                    <textarea
                                        name={field.name}
                                        required={field.required}
                                        onChange={handleInputChange}
                                        className="w-full p-4 bg-[var(--bg-primary)] border border-[var(--bg-tertiary)] rounded-xl text-[var(--text-primary)] text-xs font-medium focus:border-[var(--accent-secondary)] focus:outline-none transition-all placeholder:text-[var(--text-secondary)]/30 h-32 uppercase tracking-wide"
                                        placeholder={`ENTER ${field.label.toUpperCase()}`}
                                    />
                                ) : (
                                    <input
                                        type={field.type || 'text'}
                                        name={field.name}
                                        required={field.required}
                                        onChange={handleInputChange}
                                        className="w-full p-4 bg-[var(--bg-primary)] border border-[var(--bg-tertiary)] rounded-xl text-[var(--text-primary)] text-xs font-medium focus:border-[var(--accent-secondary)] focus:outline-none transition-all placeholder:text-[var(--text-secondary)]/30 uppercase tracking-wide"
                                        placeholder={`ENTER ${field.label.toUpperCase()}`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 flex justify-end">
                        <button type="submit" className="px-8 py-4 bg-[var(--accent-primary)] text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl hover:bg-[var(--accent-secondary)] transition-all">
                            Save Record
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-1 bg-[var(--bg-tertiary)] rounded-full mb-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[var(--accent-secondary)] animate-loading-bar"></div>
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[var(--text-secondary)] animate-pulse">Syncing Data...</p>
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-[var(--bg-tertiary)] rounded-2xl bg-[var(--bg-primary)]/50">
                    <p className="text-[var(--text-secondary)] font-bold text-[10px] uppercase tracking-widest">No records found</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-[var(--bg-tertiary)] bg-[var(--bg-primary)] shadow-xl text-xs">
                    <table className="min-w-full">
                        <thead className="bg-[var(--bg-tertiary)]/50">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Details</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Created</th>
                                <th className="px-8 py-5 text-right text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--bg-tertiary)]">
                            {items.map((item) => {
                                const imageUrl = item.imageUrl
                                    ? (item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:5000${item.imageUrl}`)
                                    : null;
                                return (
                                    <tr key={item._id} className="hover:bg-[var(--bg-tertiary)]/10 transition-all group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                {imageUrl && (
                                                    <img src={imageUrl} alt="" className="w-10 h-10 object-cover rounded-lg border border-[var(--bg-tertiary)]" />
                                                )}
                                                <div>
                                                    <div className="font-bold text-[var(--text-primary)] uppercase tracking-tight">{item.title || item.name}</div>
                                                    <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest mt-1 line-clamp-1 truncate max-w-xs">{item.description || item.abstract || item.purpose}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                                            {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="px-4 py-2 bg-red-600/10 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all text-[9px] font-bold uppercase tracking-widest"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ItemManager;
