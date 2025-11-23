import React from 'react';
import { EMPLOYERS, FREELANCE_CLIENTS } from '../constants';

const Clients: React.FC = () => {
  // Duplicate lists to create seamless loop
  const employersLoop = [...EMPLOYERS, ...EMPLOYERS, ...EMPLOYERS, ...EMPLOYERS];
  const freelanceLoop = [...FREELANCE_CLIENTS, ...FREELANCE_CLIENTS, ...FREELANCE_CLIENTS];

  return (
    <div className="py-12 border-y border-gray-800 bg-dark/50 backdrop-blur-sm relative overflow-hidden">
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        .animate-scroll-slow {
          animation: scroll 30s linear infinite;
        }
      `}</style>

      {/* Gradient Masks */}
      <div className="absolute top-0 left-0 h-full w-20 md:w-40 bg-gradient-to-r from-dark to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 h-full w-20 md:w-40 bg-gradient-to-l from-dark to-transparent z-10 pointer-events-none"></div>

      {/* Section 1: Employment */}
      <div className="mb-10">
        <p className="text-center text-xs font-mono text-accent/70 uppercase tracking-[0.2em] mb-6">
          Career Experience
        </p>
        <div className="flex w-full overflow-hidden">
          <div className="flex items-center gap-16 md:gap-32 animate-scroll-slow whitespace-nowrap px-4 pl-12">
            {employersLoop.map((client, index) => (
              <div 
                key={`emp-${client.id}-${index}`} 
                className="flex flex-col items-center justify-center gap-3 group select-none min-w-[120px]"
              >
                {/* Logo Wrapper - White bg ensures all logos (black or colored) are visible */}
                <div className="w-28 h-16 bg-white rounded-lg flex items-center justify-center p-3 shadow-lg hover:scale-105 transition-all duration-300 border border-gray-200">
                  <img 
                    src={client.logo} 
                    alt={`${client.name} logo`} 
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* Name */}
                <span className="text-xs font-mono font-bold text-gray-400 group-hover:text-white transition-colors uppercase tracking-wider">
                  {client.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Freelance */}
      <div className="mt-8">
        <p className="text-center text-xs font-mono text-gray-500 uppercase tracking-[0.2em] mb-6">
          Freelance & Collaborations
        </p>
        <div className="flex w-full overflow-hidden">
          <div className="flex items-center gap-12 md:gap-24 animate-scroll whitespace-nowrap px-4 pl-12">
            {freelanceLoop.map((client, index) => (
              <div 
                key={`free-${client.id}-${index}`} 
                className="flex flex-col items-center justify-center gap-3 group select-none min-w-[100px]"
              >
                 <div className="w-24 h-14 bg-white rounded-lg flex items-center justify-center p-3 shadow-lg hover:scale-105 transition-all duration-300 border border-gray-200">
                  <img 
                    src={client.logo} 
                    alt={`${client.name} logo`} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[10px] font-mono font-bold text-gray-500 group-hover:text-gray-300 transition-colors uppercase tracking-wider">
                  {client.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Clients;