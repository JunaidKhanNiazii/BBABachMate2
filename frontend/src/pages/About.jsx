import React from 'react';

function About() {
  return (
    <div className="max-w-7xl mx-auto py-32 px-6 lg:px-8">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center gap-16 mb-32">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tight uppercase leading-tight">
            OUR <span className="text-blue-600">MISSION</span>
          </h1>
          <p className="text-gray-400 font-medium text-sm leading-relaxed tracking-wide">
            AICON is dedicated to fostering innovation and collaboration by creating a seamless bridge between academia and industry.
            We establish a robust ecosystem where knowledge meets execution, driving progress across the industrial landscape.
          </p>
        </div>
        <div className="lg:w-1/2">
          <img
            src="/images/innovation_abstract.png"
            alt="AICON Innovation"
            className="w-full rounded-2xl border border-white/5 shadow-2xl grayscale opacity-90"
          />
        </div>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        <div className="bg-neutral-900/50 p-10 rounded-2xl border border-white/5">
          <h2 className="text-xl font-black mb-6 uppercase tracking-tight">MISSION DATA</h2>
          <p className="text-gray-500 font-medium text-xs leading-relaxed uppercase tracking-widest">
            We empower the next generation of professionals by integrating academic research with industrial requirements,
            facilitating the exchange of ideas and talent to create sustainable value.
          </p>
        </div>

        <div className="bg-neutral-900/50 p-10 rounded-2xl border border-white/5">
          <h2 className="text-xl font-black mb-6 uppercase tracking-tight">VISION PROTOCOL</h2>
          <p className="text-gray-500 font-medium text-xs leading-relaxed uppercase tracking-widest">
            To be the leading platform for academic-industrial synergy, recognized for driving innovation,
            economic growth, and professional excellence through strategic partnerships.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-neutral-950 border border-white/5 p-12 md:p-20 rounded-2xl text-center">
        <h3 className="text-3xl font-black mb-6 uppercase tracking-tight">Strategic Synergy</h3>
        <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-sm font-medium leading-relaxed">
          Driving tangible results in research, product development, and talent acquisition.
        </p>
        <button className="px-10 py-4 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 shadow-xl">
          Learn More
        </button>
      </div>
    </div>
  );
}

export default About;