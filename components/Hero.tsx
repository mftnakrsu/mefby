import React from 'react';
import { PROFILE } from '../constants';

const Hero: React.FC = () => {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20">
      <div className="max-w-6xl mx-auto px-6 w-full py-20">
        <p className="text-accent font-mono text-sm tracking-widest uppercase mb-8">
          AI Engineer
        </p>

        <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-bold text-white tracking-tighter leading-[0.85] font-mono mb-10">
          Meftun<br />Akarsu
        </h1>

        <p className="text-lg md:text-xl text-zinc-500 max-w-xl leading-relaxed mb-16">
          I build AI systems for aerospace, manufacturing, and social impact.
          Currently deploying LLMs at{' '}
          <span className="text-zinc-300">Turkish Aerospace</span>, previously{' '}
          <span className="text-zinc-300">Bosch</span>.
        </p>

        <div className="flex items-center gap-6">
          <a
            href="#projects"
            onClick={(e) => handleScrollTo(e, '#projects')}
            className="px-7 py-3.5 bg-white text-zinc-900 font-medium rounded-full hover:bg-zinc-200 transition-colors cursor-pointer text-sm"
          >
            View Work
          </a>
          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, '#contact')}
            className="px-7 py-3.5 text-zinc-400 border border-zinc-800 rounded-full hover:border-zinc-600 hover:text-white transition-all cursor-pointer text-sm"
          >
            Get in Touch
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-6 md:left-auto md:right-12 text-zinc-700 font-mono text-xs tracking-wider">
        {PROFILE.location}
      </div>
    </section>
  );
};

export default Hero;
