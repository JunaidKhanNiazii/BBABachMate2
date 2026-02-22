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
        <div className="min-h-screen bg-[var(--bg-primary)] py-24 px-6 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center text-center mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="w-20 h-1 bg-[var(--accent-secondary)] rounded-full mb-8"></div>
                    <h1 className="text-5xl md:text-7xl font-black text-[var(--text-primary)] mb-6 tracking-tighter uppercase">{title} <span className="text-[var(--accent-secondary)]">HUNT</span></h1>
                    <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest italic leading-relaxed">Browsing Active Professional Opportunities in {title}</p>
                </div>

                <div className="mb-16 max-w-3xl mx-auto">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder={`Filter ${type} records...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[var(--bg-secondary)] px-8 py-5 rounded-2xl border border-[var(--bg-tertiary)] focus:border-[var(--accent-secondary)]/50 focus:outline-none shadow-sm text-[var(--text-primary)] font-bold placeholder:text-[var(--text-secondary)]/30 transition-all uppercase text-xs tracking-widest"
                        />
                    </div>
                </div>

                {loading && (
                    <div className="text-center py-40">
                        <div className="inline-block animate-spin rounded-xl h-12 w-12 border-4 border-[var(--accent-secondary)]/20 border-t-[var(--accent-secondary)] shadow-2xl"></div>
                        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)] animate-pulse">Syncing Database...</p>
                    </div>
                )}

                {!loading && filteredItems.length === 0 && (
                    <div className="text-center py-32 bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-[3rem] border-dashed">
                        <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
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
        ? (speaker.imageUrl.startsWith('http') ? speaker.imageUrl : `https://bbabachmate2026-821t2dq3p-junaidkhanniaziis-projects.vercel.app${speaker.imageUrl}`)
        : null;

    return (
        <div className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:border-[var(--accent-secondary)]/20 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2 flex flex-col items-center text-center p-10">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl mb-8 ring-8 ring-blue-50/50 group-hover:ring-[var(--accent-secondary)]/10 transition-all">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={speaker.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300 font-black text-5xl">
                        {speaker.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                )}
            </div>

            <div className="mb-8">
                <h3 className="text-3xl font-black text-[var(--accent-primary)] tracking-tighter uppercase mb-2 leading-none">{speaker.name}</h3>
                <p className="text-[11px] font-bold text-[var(--accent-secondary)] uppercase tracking-[0.3em]">{speaker.designation || "Expert Consultant"}</p>
            </div>

            <div className="flex justify-center gap-4 mb-10">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-sm">📞</div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-sm">✉️</div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-sm">•••</div>
            </div>

            <div className="w-full p-6 bg-gray-50/50 rounded-[2rem] mb-6 border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-xl border border-gray-100">🏢</div>
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Affiliation</p>
                        <p className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tight">{speaker.organization || "Independent"}</p>
                    </div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            <button className="w-full py-5 bg-white border-2 border-black text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all active:scale-95 shadow-lg">
                View Full Profile
            </button>
        </div>
    );
}

function ItemCard({ item, type }) {
    const imageUrl = item.imageUrl
        ? (item.imageUrl.startsWith('http') ? item.imageUrl : `https://bbabachmate2026-821t2dq3p-junaidkhanniaziis-projects.vercel.app${item.imageUrl}`)
        : null;

    // Determine brand color based on type
    const isIndustry = type.includes('jobs') || type.includes('internships') || type.includes('challenges') || type.includes('research');
    const brandColor = isIndustry ? "var(--accent-secondary)" : "var(--accent-primary)";

    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden flex flex-col lg:flex-row gap-10">
            <div className={`absolute top-0 right-0 w-40 h-40 opacity-5 blur-[100px] rounded-full`} style={{ backgroundColor: brandColor }}></div>

            {imageUrl && (
                <div className="w-full lg:w-64 h-64 flex-shrink-0 rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-xl transition-all">
                    <img
                        src={imageUrl}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                </div>
            )}

            <div className="flex-1 flex flex-col">
                <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-blue-50 text-[var(--accent-secondary)] rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100">{item.domain || item.category || type.split('/').pop()}</span>
                            {item.type && <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-gray-100">{item.type}</span>}
                        </div>
                        <h3 className="text-3xl md:text-5xl font-black text-[var(--accent-primary)] tracking-tighter uppercase leading-none">{item.title || item.name}</h3>
                    </div>
                    <button className="px-10 py-5 bg-[var(--accent-primary)] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl active:scale-95">
                        Inquire Details
                    </button>
                </div>

                <p className="text-[var(--text-secondary)] font-medium text-base md:text-lg mb-10 line-clamp-3 leading-relaxed italic max-w-4xl">
                    {item.description || item.abstract || item.problemStatement}
                </p>

                <div className="flex flex-wrap gap-3 mt-auto pt-8 border-t border-gray-50">
                    {item.location && <FeatureBadge icon="📍" label={item.location} />}
                    {item.duration && <FeatureBadge icon="⏱️" label={item.duration} />}
                    {item.stipendType && <FeatureBadge icon="💰" label={item.stipendType} />}
                    {item.deadline && <FeatureBadge icon="📅" label={new Date(item.deadline).toLocaleDateString()} />}
                    {item.supervisor && <FeatureBadge icon="👤" label={item.supervisor} />}
                </div>

                {item.createdBy && (
                    <div className="mt-10 flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 self-start">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-xs font-black text-[var(--accent-secondary)]">
                            {item.createdBy.profile?.name?.charAt(0) || 'E'}
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Verified Origin</p>
                            <p className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tight">{item.createdBy.profile?.name}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function FeatureBadge({ icon, label }) {
    return (
        <div className="flex items-center space-x-2 px-5 py-3 bg-white border border-gray-100 rounded-xl hover:border-blue-200 transition-colors shadow-sm">
            <span className="text-base">{icon}</span>
            <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{label}</span>
        </div>
    );
}

function Attribute({ icon, label, variant = 'gray' }) {
    const classes = variant === 'blue'
        ? "bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)] border-[var(--accent-secondary)]/20"
        : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--bg-tertiary)]";

    return (
        <div className={`flex items-center space-x-2 px-5 py-2.5 border rounded-xl transition-all hover:border-[var(--accent-secondary)]/30 ${classes}`}>
            {icon && <span className="text-sm mr-1">{icon}</span>}
            <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
        </div>
    );
}

export default PublicListing;
