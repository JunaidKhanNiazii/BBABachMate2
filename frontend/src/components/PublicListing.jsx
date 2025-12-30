import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function PublicListing({ title, endpoint }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const type = endpoint.split('/').pop();
    const isSpeakers = type === 'speakers';

    useEffect(() => {
        fetchItems();
    }, [endpoint]);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const res = await api.get(endpoint);
            if (res.data.success) {
                setItems(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching items:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = items.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (item.title?.toLowerCase().includes(searchLower)) ||
            (item.name?.toLowerCase().includes(searchLower)) ||
            (item.description?.toLowerCase().includes(searchLower)) ||
            (item.topic?.toLowerCase().includes(searchLower)) ||
            (item.domain?.toLowerCase().includes(searchLower))
        );
    });

    return (
        <div className="min-h-screen bg-black py-24 px-6 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center text-center mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="w-20 h-1 bg-blue-600 rounded-full mb-8"></div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase">{title} <span className="text-blue-600">HUNT</span></h1>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic leading-relaxed">Browsing Active Professional Opportunities in {title}</p>
                </div>

                <div className="mb-16 max-w-3xl mx-auto">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder={`Filter ${type} records...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-neutral-900 px-8 py-5 rounded-2xl border border-white/5 focus:border-blue-600/50 focus:outline-none shadow-2xl text-white font-bold placeholder:text-gray-700 transition-all uppercase text-xs tracking-widest"
                        />
                    </div>
                </div>

                {loading && (
                    <div className="text-center py-40">
                        <div className="inline-block animate-spin rounded-xl h-12 w-12 border-4 border-blue-600/20 border-t-blue-600 shadow-2xl"></div>
                        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 animate-pulse">Syncing Database...</p>
                    </div>
                )}

                {!loading && filteredItems.length === 0 && (
                    <div className="text-center py-32 bg-neutral-900 border border-white/5 rounded-[3rem] border-dashed">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-600">
                            {searchTerm ? `No results found for "${searchTerm.toUpperCase()}"` : `The ${type.toUpperCase()} registry is currently empty`}
                        </p>
                    </div>
                )}

                {!loading && filteredItems.length > 0 && (
                    <div className={isSpeakers ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10' : 'space-y-8'}>
                        {filteredItems.map((item) => (
                            isSpeakers ? (
                                <SpeakerCard key={item._id} speaker={item} />
                            ) : (
                                <ItemCard key={item._id} item={item} type={type} />
                            )
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function SpeakerCard({ speaker }) {
    const imageUrl = speaker.imageUrl
        ? (speaker.imageUrl.startsWith('http') ? speaker.imageUrl : `http://localhost:5000${speaker.imageUrl}`)
        : null;

    return (
        <div className="group bg-neutral-900 rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-blue-600/20 transition-all duration-500 shadow-2xl hover:-translate-y-2">
            <div className="h-80 bg-neutral-800 relative overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={speaker.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                        <div className="text-gray-700 text-8xl font-black opacity-30">
                            {speaker.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-neutral-900 to-transparent">
                    <p className="text-blue-500 font-bold uppercase tracking-widest text-[9px] mb-2">{speaker.designation || "Expert Specialist"}</p>
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{speaker.name}</h3>
                </div>
            </div>

            <div className="p-10">
                <div className="flex flex-wrap gap-2 mb-8">
                    {speaker.roleType?.split(',').map(role => (
                        <span key={role} className="px-3 py-1 bg-white/5 text-gray-400 rounded-full text-[8px] font-bold uppercase tracking-widest border border-white/5">{role.trim()}</span>
                    ))}
                </div>

                <p className="text-gray-400 font-medium text-sm mb-10 leading-relaxed italic line-clamp-3">
                    {speaker.bio || speaker.topic}
                </p>

                <div className="grid grid-cols-2 gap-6 mb-10 pb-10 border-b border-white/5">
                    <div>
                        <p className="text-[8px] uppercase font-black text-gray-600 tracking-widest mb-1">Experience</p>
                        <p className="text-xs font-bold text-white uppercase">{speaker.experience || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-[8px] uppercase font-black text-gray-600 tracking-widest mb-1">Organization</p>
                        <p className="text-xs font-bold text-white uppercase">{speaker.organization || "Independent"}</p>
                    </div>
                </div>

                {speaker.createdBy && (
                    <div className="flex items-center justify-between">
                        <span className="text-[8px] font-bold text-gray-700 uppercase tracking-widest italic">Registered By</span>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter border-b border-blue-500/20">{speaker.createdBy.profile?.name}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function ItemCard({ item, type }) {
    const imageUrl = item.imageUrl
        ? (item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:5000${item.imageUrl}`)
        : null;

    return (
        <div className="bg-neutral-900 rounded-[2rem] border border-white/5 p-10 hover:bg-neutral-800/80 transition-all duration-500 group shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[80px] rounded-full"></div>

            <div className="flex flex-col md:flex-row gap-12 relative z-10">
                {imageUrl && (
                    <div className="w-full md:w-56 h-56 flex-shrink-0 rounded-[2rem] overflow-hidden border border-white/5 bg-neutral-800 group-hover:border-blue-500/30 transition-all">
                        <img
                            src={imageUrl}
                            alt={item.title || item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    </div>
                )}

                <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="space-y-1">
                            <p className="text-blue-500 font-bold uppercase tracking-[0.2em] text-[10px]">{item.domain || item.category || type.slice(0, -1)}</p>
                            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase">{item.title || item.name}</h3>
                        </div>
                        <div className="px-5 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl group-hover:bg-blue-700 transition-all cursor-pointer">
                            View Details
                        </div>
                    </div>

                    <p className="text-gray-500 font-medium text-sm mb-10 line-clamp-2 max-w-4xl leading-loose italic">
                        {item.description || item.abstract || item.problemStatement}
                    </p>

                    <div className="flex flex-wrap gap-4 items-center">
                        {item.location && <Attribute icon="📍" label={item.location} />}
                        {item.type && <Attribute label={item.type} variant="blue" />}
                        {item.duration && <Attribute icon="⏱️" label={item.duration} />}
                        {item.stipendType && <Attribute icon="💰" label={item.stipendType} />}
                        {item.deadline && <Attribute icon="📅" label={`Deadline: ${new Date(item.deadline).toLocaleDateString()}`} />}
                        {item.supervisor && <Attribute icon="👤" label={`Supervisor: ${item.supervisor}`} />}
                    </div>

                    {item.createdBy && (
                        <div className="mt-12 pt-8 border-t border-white/5 flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 text-[10px] font-black text-gray-500 uppercase tracking-tighter italic">
                                {item.createdBy.profile?.name?.charAt(0)}
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">Origin Entity</p>
                                <p className="text-sm font-black text-white uppercase tracking-tighter italic">{item.createdBy.profile?.name}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Attribute({ icon, label, variant = 'gray' }) {
    const classes = variant === 'blue'
        ? "bg-blue-600/10 text-blue-500 border-blue-500/20"
        : "bg-white/5 text-gray-400 border-white/5";

    return (
        <div className={`flex items-center space-x-2 px-5 py-2.5 border rounded-xl transition-all hover:border-blue-500/30 ${classes}`}>
            {icon && <span className="text-sm mr-1">{icon}</span>}
            <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
        </div>
    );
}

export default PublicListing;
