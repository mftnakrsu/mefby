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

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-dark">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-[0.07]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent"></div>

      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 mb-6 border border-accent/30 rounded-full bg-accent/10 backdrop-blur-sm">
            <span className="text-accent font-mono text-xs md:text-sm tracking-widest uppercase">
              AI Engineer & Data Scientist
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight leading-none font-mono">
            Building the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
              Autonomous Future
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-12 leading-relaxed font-light">
            Hi, I'm <strong className="text-white font-medium">{PROFILE.owner}</strong>. 
            I engineer intelligent systems at the intersection of 
            <span className="text-accent"> Computer Vision</span>, 
            <span className="text-purple-400"> LLMs</span>, and 
            <span className="text-blue-400"> Robotics</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="#projects"
              onClick={(e) => handleScrollTo(e, '#projects')}
              className="group relative px-8 py-4 bg-white text-dark font-bold rounded-full overflow-hidden transition-all hover:scale-105 cursor-pointer"
            >
              <span className="relative z-10">View Selected Work</span>
              <div className="absolute inset-0 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              <span className="absolute inset-0 z-10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">View Selected Work</span>
            </a>
            
            <a
              href="#contact"
              onClick={(e) => handleScrollTo(e, '#contact')}
              className="px-8 py-4 text-white border border-gray-700 rounded-full hover:border-accent hover:text-accent transition-all duration-300 font-medium cursor-pointer"
            >
              Let's Talk
            </a>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-gray-600">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;