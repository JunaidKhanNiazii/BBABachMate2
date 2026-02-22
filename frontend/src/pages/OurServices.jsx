import React, { useEffect, useRef, useState } from 'react';

function OurServices() {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const itemRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute('data-index');
            setVisibleItems((prev) => new Set([...prev, parseInt(index)]));
          }
        });
      },
      { threshold: 0.1 }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const industryServices = [
    {
      title: "Jobs",
      description: "AICON connects industries with universities by providing a platform to share verified job opportunities for graduates, researchers, and faculty. Through the platform, companies can easily reach academic talent."
    },
    {
      title: "Internships",
      description: "AICON enables industries to offer structured internship programs to students from partner universities. The platform helps companies identify skilled interns who can contribute to real-world projects."
    },
    {
      title: "Governance",
      description: "AICON allows industries to engage with universities by participating as guest speakers, visiting faculty, or advisory board members, sharing expertise and shaping academic programs."
    },
    {
      title: "Innovation",
      description: "AICON provides industries with the ability to post challenges, sponsor research, and fund academic projects, leveraging university expertise for innovation."
    },
    {
      title: "Collaborative Services",
      description: "AICON supports industries in building long-term partnerships with universities through joint research, consultancy, and innovation projects for business growth."
    }
  ];

  const universityServices = [
    {
      title: "FYP Projects",
      description: "AICON enables universities to collaborate with industries by offering Final Year Projects based on real-world industry problems. Students gain practical experience."
    },
    {
      title: "Collaboration Products",
      description: "AICON allows universities to showcase research products, prototypes, and academic services for potential industrial collaboration and commercialization."
    },
    {
      title: "Courses & Training",
      description: "AICON provides universities the opportunity to offer courses and training programs aligned with industry needs. Students and professionals benefit from practical learning."
    },
    {
      title: "Open House Nominations",
      description: "AICON allows universities to invite industries to open houses and career events, promoting networking and collaboration between students and professionals."
    },
    {
      title: "Academic Partnerships",
      description: "AICON supports universities in establishing long-term collaboration with industries through joint research, consultancy, and innovation projects."
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-blue-500/30 overflow-x-hidden pt-20 pb-32">
      {/* Background Subtle Accents */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        {/* Intro Hero Section - Compact */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full animate-in fade-in slide-in-from-bottom-2 duration-700 mb-6">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
            <span className="text-[9px] font-black text-blue-800 uppercase tracking-widest">Service Framework</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.8] text-black animate-in fade-in slide-in-from-top-4 duration-1000 mb-8">
            Strategic <span className="text-blue-600">Synergy</span>
          </h1>

          <p className="text-[var(--text-secondary)] text-base md:text-lg font-bold leading-relaxed max-w-2xl mx-auto border-t border-gray-100 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            AICON delivers specialized service protocols that synchronize academic research with industrial performance, creating a high-velocity ecosystem for innovation.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative">
          {/* Column Headers - Clear Distinction */}
          <div className="hidden md:grid grid-cols-2 gap-16 mb-12 border-b border-gray-100 pb-6">
            <div className="text-center">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600/60 block mb-2">Sector Alpha</span>
              <h3 className="text-2xl font-black uppercase text-black italic">For Universities</h3>
            </div>
            <div className="text-center">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600/60 block mb-2">Sector Beta</span>
              <h3 className="text-2xl font-black uppercase text-black italic">For Industries</h3>
            </div>
          </div>

          {/* Central Vertical Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-16 bottom-0 w-px bg-gradient-to-b from-blue-600/10 via-blue-600/30 to-blue-600/10 hidden md:block"></div>

          {/* Service Entries */}
          <div className="space-y-12 md:space-y-6">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                ref={(el) => (itemRefs.current[index] = el)}
                data-index={index}
                className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center transition-all duration-1000 ease-out ${visibleItems.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              >

                {/* University Service (Left) */}
                <div className="md:pr-8 group">
                  <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                    <div className="text-xl font-black text-blue-600/5 mb-2 group-hover:text-blue-600/10 transition-colors uppercase italic tracking-tighter">Univ .0{index + 1}</div>
                    <h2 className="text-lg font-black uppercase text-black mb-2 tracking-tight border-l-3 border-blue-600 pl-3">{universityServices[index].title}</h2>
                    <p className="text-[var(--text-secondary)] text-[12px] font-medium leading-relaxed">
                      {universityServices[index].description}
                    </p>
                  </div>
                </div>

                {/* Industry Service (Right) */}
                <div className="md:pl-8 group">
                  <div className="bg-blue-600 p-6 md:p-8 rounded-[2rem] shadow-lg hover:shadow-blue-600/30 transition-all duration-500 hover:-translate-y-1 relative">
                    <div className="text-xl font-black text-white/10 mb-2 group-hover:text-white/20 transition-colors uppercase italic tracking-tighter">Indus .0{index + 1}</div>
                    <h2 className="text-lg font-black uppercase text-white mb-2 tracking-tight border-l-3 border-white pl-3">{industryServices[index].title}</h2>
                    <p className="text-blue-50 text-[12px] font-medium leading-relaxed">
                      {industryServices[index].description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OurServices;
