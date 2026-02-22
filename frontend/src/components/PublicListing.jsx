import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function PublicListing({ title, endpoint }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                <div className="flex flex-col items-center text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="w-12 h-1 bg-[var(--accent-secondary)] rounded-full mb-6"></div>
                    <h1 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] mb-3 tracking-tighter uppercase">{title} <span className="text-[var(--accent-secondary)]">PORTAL</span></h1>
                    <p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.3em] italic leading-relaxed opacity-70">Exploring {title} Management Registry</p>
                </div>

                <div className="mb-12 max-w-2xl mx-auto">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder={`Search ${type}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[var(--bg-secondary)] px-6 py-4 rounded-xl border border-[var(--bg-tertiary)] focus:border-[var(--accent-secondary)]/50 focus:outline-none shadow-sm text-[var(--text-primary)] font-bold placeholder:text-[var(--text-secondary)]/30 transition-all uppercase text-[10px] tracking-widest"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredItems.map((item) => (
                            isSpeakers ? (
                                <SpeakerCard
                                    key={item._id}
                                    speaker={item}
                                    onView={() => {
                                        setSelectedItem(item);
                                        setIsModalOpen(true);
                                    }}
                                />
                            ) : (
                                <ItemCard
                                    key={item._id}
                                    item={item}
                                    type={type}
                                    onInquire={() => {
                                        setSelectedItem(item);
                                        setIsModalOpen(true);
                                    }}
                                />
                            )
                        ))}
                    </div>
                )}

                {/* Detail Modal */}
                {isModalOpen && selectedItem && (
                    <DetailModal
                        item={selectedItem}
                        isSpeaker={isSpeakers}
                        type={type}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedItem(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
}

function SpeakerCard({ speaker, onView }) {
    const imageUrl = speaker.imageUrl
        ? (speaker.imageUrl.startsWith('http') ? speaker.imageUrl : `https://bbabachmate2026-821t2dq3p-junaidkhanniaziis-projects.vercel.app${speaker.imageUrl}`)
        : null;

    return (
        <div className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:border-[var(--accent-secondary)]/20 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2 flex flex-col items-center text-center p-10 relative">
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

            {/* Hover Reveal Button */}
            <div className="w-full absolute inset-x-0 bottom-0 p-10 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20 bg-gradient-to-t from-white via-white/95 to-transparent pt-32">
                <button
                    onClick={onView}
                    className="w-full py-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[var(--accent-secondary)] transition-all active:scale-95 shadow-2xl"
                >
                    View Full Profile
                </button>
            </div>
        </div>
    );
}

function ItemCard({ item, type, onInquire }) {
    const imageUrl = item.imageUrl
        ? (item.imageUrl.startsWith('http') ? item.imageUrl : `https://bbabachmate2026-821t2dq3p-junaidkhanniaziis-projects.vercel.app${item.imageUrl}`)
        : null;

    // Determine brand color based on type
    const isIndustry = type.includes('jobs') || type.includes('internships') || type.includes('challenges') || type.includes('research');
    const brandColor = isIndustry ? "var(--accent-secondary)" : "var(--accent-primary)";

    return (
        <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full shadow-sm relative">
            {/* Header Image */}
            <div className="h-44 w-full relative overflow-hidden bg-gray-50">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20" style={{ background: brandColor }}>
                        <span className="text-white font-black text-2xl uppercase italic">AICON</span>
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm shadow-sm rounded-md text-[8px] font-black uppercase tracking-widest text-[var(--accent-primary)] border border-gray-100">
                        {item.domain || item.category || type.split('/').pop()}
                    </span>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-base font-black text-[var(--text-primary)] tracking-tight uppercase mb-2 line-clamp-2 leading-tight group-hover:text-[var(--accent-secondary)] transition-colors">
                    {item.title || item.name}
                </h3>

                <p className="text-[10px] font-bold text-gray-400 mb-4 line-clamp-2 uppercase leading-relaxed italic">
                    {item.description || item.abstract || item.problemStatement}
                </p>

                <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                    {item.location && <FeatureBadge icon="📍" label={item.location} />}
                    {item.type && <FeatureBadge label={item.type} />}
                </div>

                {/* Footer Section */}
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-50 rounded-full flex items-center justify-center text-[8px] font-black text-[var(--accent-secondary)] border border-gray-100">
                            {item.createdBy?.profile?.name?.charAt(0) || 'E'}
                        </div>
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter truncate max-w-[80px]">{item.createdBy?.profile?.name}</span>
                    </div>
                </div>

                {/* Hover Reveal Button */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 flex items-end">
                    <button
                        onClick={onInquire}
                        className="w-full py-4 bg-[var(--accent-primary)] text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
                    >
                        View More Details
                    </button>
                </div>
            </div>
        </div>
    );
}

function DetailModal({ item, isSpeaker, type, onClose }) {
    const imageUrl = item.imageUrl
        ? (item.imageUrl.startsWith('http') ? item.imageUrl : `https://bbabachmate2026-821t2dq3p-junaidkhanniaziis-projects.vercel.app${item.imageUrl}`)
        : null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
                <div className="w-full md:w-2/5 h-64 md:h-auto bg-gray-50 relative overflow-hidden">
                    {imageUrl ? (
                        <img src={imageUrl} alt={item.title || item.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-black text-6xl italic uppercase">AICON</div>
                    )}
                    <button onClick={onClose} className="absolute top-6 left-6 w-12 h-12 bg-white/20 backdrop-blur-xl text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all md:hidden">✕</button>
                </div>
                <div className="flex-1 p-8 md:p-16 overflow-y-auto bg-white">
                    <div className="mb-10 flex justify-between items-start">
                        <div>
                            <span className="px-4 py-2 bg-blue-50 text-[var(--accent-secondary)] rounded-xl text-[10px] font-black uppercase tracking-widest mb-4 inline-block border border-blue-100">
                                {item.domain || item.category || type.split('/').pop()}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-tighter uppercase mb-4 leading-none">
                                {item.title || item.name}
                            </h2>
                            {isSpeaker && <p className="text-sm font-bold text-[var(--accent-secondary)] uppercase tracking-[0.3em]">{item.designation}</p>}
                        </div>
                        <button onClick={onClose} className="hidden md:flex w-14 h-14 bg-gray-50 text-gray-400 rounded-full items-center justify-center hover:bg-black hover:text-white transition-all text-xl">✕</button>
                    </div>
                    <div className="space-y-12">
                        <div>
                            <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] mb-4">Detailed Registry Data</h4>
                            <p className="text-lg md:text-xl text-[var(--text-secondary)] font-medium leading-relaxed italic">
                                {item.description || item.abstract || item.problemStatement || item.bio || "No detailed information found in registry database."}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 pt-10 border-t border-gray-100">
                            {item.location && <ModalField label="Primary Location" value={item.location} icon="📍" />}
                            {item.type && <ModalField label="Record Category" value={item.type} icon="🏷️" />}
                            {item.duration && <ModalField label="Active Duration" value={item.duration} icon="⏱️" />}
                            {item.stipendType && <ModalField label="Financial Details" value={item.stipendType} icon="💰" />}
                            {item.deadline && <ModalField label="Registry Deadline" value={new Date(item.deadline).toLocaleDateString()} icon="📅" />}
                            {item.supervisor && <ModalField label="Point of Contact" value={item.supervisor} icon="👤" />}
                            {item.organization && <ModalField label="Affiliated Organization" value={item.organization} icon="🏢" />}
                        </div>
                        <div className="pt-12 flex flex-col sm:flex-row gap-4">
                            <button className="flex-1 py-6 bg-[var(--accent-primary)] text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all active:scale-95">Send Inquiry</button>
                            <button onClick={onClose} className="py-6 px-12 bg-white border-2 border-gray-100 text-gray-400 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:border-black hover:text-black transition-all">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ModalField({ label, value, icon }) {
    return (
        <div className="space-y-2">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
            <div className="flex items-center gap-3">
                <span className="text-lg">{icon}</span>
                <span className="text-xs font-bold text-[var(--text-primary)] uppercase truncate">{value}</span>
            </div>
        </div>
    );
}

function FeatureBadge({ icon, label }) {
    return (
        <div className="flex items-center space-x-1 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg">
            {icon && <span className="text-[10px]">{icon}</span>}
            <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
        </div>
    );
}

export default PublicListing;
