import React from 'react';
import { EMPLOYERS, FREELANCE_CLIENTS, Client } from '../constants';
import AnimatedSection from './AnimatedSection';

const LogoItem: React.FC<{ client: Client; size?: 'normal' | 'small' }> = ({ client, size = 'normal' }) => {
  const isNormal = size === 'normal';
  const inner = (
    <div className={`flex flex-col items-center gap-3 ${isNormal ? 'min-w-[100px]' : 'min-w-[90px]'}`}>
      <div className={`${isNormal ? 'w-24 h-14' : 'w-20 h-12'} bg-zinc-900 rounded-lg flex items-center justify-center ${isNormal ? 'p-3' : 'p-2.5'} border border-zinc-800`}>
        <img src={client.logo} alt={client.name} className="w-full h-full object-contain opacity-70 hover:opacity-100 transition-opacity" />
      </div>
      <span className={`${isNormal ? 'text-[10px]' : 'text-[9px]'} font-mono text-zinc-600 uppercase tracking-wider`}>{client.name}</span>
    </div>
  );

  if (client.link) {
    return <a href={client.link} target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">{inner}</a>;
  }
  return inner;
};

const Clients: React.FC = () => {
  const employersLoop = [...EMPLOYERS, ...EMPLOYERS, ...EMPLOYERS, ...EMPLOYERS];
  const freelanceLoop = [...FREELANCE_CLIENTS, ...FREELANCE_CLIENTS, ...FREELANCE_CLIENTS];

  return (
    <AnimatedSection animation="fade-in">
      <div className="py-16 border-y border-zinc-900 relative overflow-hidden">
        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll { animation: scroll 25s linear infinite; }
          .animate-scroll-slow { animation: scroll 35s linear infinite; }
        `}</style>

        <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-dark to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-dark to-transparent z-10 pointer-events-none"></div>

        <div className="mb-12">
          <p className="text-center text-[11px] font-mono text-zinc-600 uppercase tracking-[0.3em] mb-8">Worked with</p>
          <div className="flex w-full overflow-hidden">
            <div className="flex items-center gap-20 md:gap-32 animate-scroll-slow whitespace-nowrap px-4">
              {employersLoop.map((client, index) => (
                <LogoItem key={`emp-${client.id}-${index}`} client={client} />
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-center text-[11px] font-mono text-zinc-700 uppercase tracking-[0.3em] mb-8">Freelance</p>
          <div className="flex w-full overflow-hidden">
            <div className="flex items-center gap-16 md:gap-28 animate-scroll whitespace-nowrap px-4">
              {freelanceLoop.map((client, index) => (
                <LogoItem key={`free-${client.id}-${index}`} client={client} size="small" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default Clients;
