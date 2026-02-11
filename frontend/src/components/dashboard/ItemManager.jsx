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
        <div className="bg-neutral-900 border border-white/5 p-6 md:p-8 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">{title}</h2>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Management Console</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${showForm
                        ? 'bg-neutral-800 text-gray-400'
                        : 'bg-white text-black hover:bg-gray-200 shadow-xl'
                        }`}
                >
                    {showForm ? 'Cancel' : 'Add New Entry'}
                </button>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-600/10 border border-red-500/10 rounded-xl text-red-500 text-[10px] font-bold uppercase tracking-widest">
                    {error}
                </div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-12 p-8 border border-white/5 rounded-2xl bg-black/30 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {fields.map((field) => (
                            <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3 ml-1">{field.label}</label>
                                {field.type === 'file' ? (
                                    <div className="relative">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border border-white/5 border-dashed rounded-xl cursor-pointer bg-black/40 hover:bg-black/60 transition-all">
                                            <div className="text-center">
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Upload Asset</p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                        {imagePreview && (
                                            <div className="mt-4 flex justify-center">
                                                <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-white/10" />
                                            </div>
                                        )}
                                    </div>
                                ) : field.type === 'select' ? (
                                    <select
                                        name={field.name}
                                        required={field.required}
                                        onChange={handleInputChange}
                                        className="w-full p-4 bg-black border border-white/5 rounded-xl text-white text-xs font-medium focus:border-blue-500/50 focus:outline-none transition-all appearance-none uppercase tracking-wide"
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
                                            className="w-full p-4 bg-black border border-white/5 rounded-xl text-white text-xs font-medium focus:border-blue-500/50 focus:outline-none transition-all placeholder-gray-800 uppercase tracking-wide"
                                        />
                                        <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest ml-2">Separate items with commas</p>
                                    </div>
                                ) : field.type === 'textarea' ? (
                                    <textarea
                                        name={field.name}
                                        required={field.required}
                                        onChange={handleInputChange}
                                        className="w-full p-4 bg-black border border-white/5 rounded-xl text-white text-xs font-medium focus:border-blue-500/50 focus:outline-none transition-all placeholder-gray-800 h-32 uppercase tracking-wide"
                                        placeholder={`ENTER ${field.label.toUpperCase()}`}
                                    />
                                ) : (
                                    <input
                                        type={field.type || 'text'}
                                        name={field.name}
                                        required={field.required}
                                        onChange={handleInputChange}
                                        className="w-full p-4 bg-black border border-white/5 rounded-xl text-white text-xs font-medium focus:border-blue-500/50 focus:outline-none transition-all placeholder-gray-800 uppercase tracking-wide"
                                        placeholder={`ENTER ${field.label.toUpperCase()}`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 flex justify-end">
                        <button type="submit" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all">
                            Save Record
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-1 bg-white/5 rounded-full mb-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-600 animate-loading-bar"></div>
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-600 animate-pulse">Syncing Data...</p>
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/5 rounded-2xl bg-black/10">
                    <p className="text-gray-600 font-bold text-[10px] uppercase tracking-widest">No records found</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-white/5 bg-black/20 shadow-xl text-xs">
                    <table className="min-w-full">
                        <thead className="bg-white/[0.02]">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Details</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Created</th>
                                <th className="px-8 py-5 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {items.map((item) => {
                                const imageUrl = item.imageUrl
                                    ? (item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:5000${item.imageUrl}`)
                                    : null;
                                return (
                                    <tr key={item._id} className="hover:bg-white/[0.01] transition-all group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                {imageUrl && (
                                                    <img src={imageUrl} alt="" className="w-10 h-10 object-cover rounded-lg border border-white/5" />
                                                )}
                                                <div>
                                                    <div className="font-bold text-white uppercase tracking-tight">{item.title || item.name}</div>
                                                    <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1 line-clamp-1 truncate max-w-xs">{item.description || item.abstract || item.purpose}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                            {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="px-4 py-2 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all text-[9px] font-bold uppercase tracking-widest"
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
