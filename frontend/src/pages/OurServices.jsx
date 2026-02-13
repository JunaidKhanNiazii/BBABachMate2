import React from 'react';

function OurServices() {
  const industryServices = [
    { title: "Jobs", description: "Verified career opportunities for graduates and researchers." },
    { title: "Internships", description: "Structured industry experience programs for academic talent." },
    { title: "Governance", description: "Engagement through guest speaking and advisory boards." },
    { title: "Innovation", description: "Sponsored research and industrial challenge funding." },
    { title: "Development", description: "Strategic consultancy and collaborative innovation projects." }
  ];

  const universityServices = [
    { title: "Research", description: "Industry-aligned Final Year Projects and research cycles." },
    { title: "Prototypes", description: "Showcasing academic products for commercialization." },
    { title: "Upskilling", description: "Training programs and courses tailored for industry need." },
    { title: "Networking", description: "Open House nominations and career development events." },
    { title: "Integration", description: "Long-term synergy through joint academic-industrial ventures." }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto py-32 px-6 lg:px-8">
        <div className="max-w-3xl mb-32">
          <h1 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-6 tracking-tight uppercase">
            SERVICE <span className="text-[var(--accent-secondary)]">PROTOCOLS</span>
          </h1>
          <p className="text-[var(--text-secondary)] font-medium text-sm leading-relaxed max-w-2xl">
            Comprehensive collaboration frameworks designed to bridge the gap between
            industrial requirements and academic innovation.
          </p>
        </div>

        {/* Industry Section */}
        <div className="mb-40">
          <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-black uppercase mb-4 tracking-tight text-[var(--text-primary)]">INDUSTRY <span className="text-[var(--accent-secondary)]">SERVICES</span></h2>
              <p className="text-[var(--text-secondary)] text-sm font-medium leading-relaxed uppercase tracking-widest border-l-2 border-[var(--accent-primary)] pl-4">
                Strategic talent and research acquisition for modern enterprises.
              </p>
            </div>
            <div className="lg:w-1/2">
              <img
                src="/images/industry_sector.png"
                alt="Industry Protocols"
                className="w-full h-40 object-cover rounded-xl border border-white/5 grayscale"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industryServices.map((service, idx) => (
              <div key={idx} className="bg-[var(--bg-secondary)] p-8 rounded-xl border border-[var(--bg-tertiary)] hover:border-[var(--accent-secondary)]/20 transition-all shadow-sm">
                <h3 className="text-lg font-black text-[var(--text-primary)] mb-4 uppercase tracking-tight">{service.title}</h3>
                <p className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-widest leading-relaxed opacity-80">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* University Section */}
        <div className="mb-20">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 mb-16">
            <div className="lg:w-1/2 text-right lg:text-right">
              <h2 className="text-3xl font-black uppercase mb-4 tracking-tight text-[var(--text-primary)]">UNIVERSITY <span className="text-[var(--text-primary)] opacity-50">SERVICES</span></h2>
              <p className="text-[var(--text-secondary)] text-sm font-medium leading-relaxed uppercase tracking-widest border-r-2 border-[var(--accent-primary)] pr-4">
                Empowering academic institutions through industrial synergy.
              </p>
            </div>
            <div className="lg:w-1/2">
              <img
                src="/images/academic_research.png"
                alt="University Protocols"
                className="w-full h-40 object-cover rounded-xl border border-white/5 grayscale"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universityServices.map((service, idx) => (
              <div key={idx} className="bg-[var(--bg-secondary)] p-8 rounded-xl border border-[var(--bg-tertiary)] hover:border-[var(--accent-secondary)]/20 transition-all shadow-sm">
                <h3 className="text-lg font-black text-[var(--text-primary)] mb-4 uppercase tracking-tight">{service.title}</h3>
                <p className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-widest leading-relaxed opacity-80">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OurServices;
