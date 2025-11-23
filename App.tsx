import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ChatBot from './components/ChatBot';
import Stats from './components/Stats';
import Clients from './components/Clients';
import { EXPERIENCE, PROJECTS, SERVICES, PROFILE } from './constants';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark text-slate-200 font-sans selection:bg-accent selection:text-dark">
      <Navbar />
      
      <main>
        <Hero />
        <Clients />

        {/* About & Services Section */}
        <section id="about" className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              
              {/* Text Content */}
              <div className="lg:col-span-7 space-y-12">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-8 font-mono text-white">
                    Engineering <span className="text-accent">Intelligence</span>.
                  </h2>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {PROFILE.bio}
                  </p>
                </div>

                {/* Services Grid - Added ID here for navigation */}
                <div id="services" className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  {SERVICES.map((service) => (
                    <div key={service.id} className="group p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-accent/50 transition-all duration-300">
                      <h3 className="text-lg font-bold text-white mb-2 font-mono">{service.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{service.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Visual */}
              <div className="lg:col-span-5 relative">
                <div className="sticky top-32">
                  <div className="bg-gray-900/30 rounded-3xl p-8 border border-gray-800 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl"></div>
                    <h3 className="text-xl font-bold mb-2 font-mono text-center">Technical Arsenal</h3>
                    <Stats />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-24 px-6 bg-secondary relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
          
          <div className="max-w-5xl mx-auto">
             <h2 className="text-3xl md:text-4xl font-bold mb-16 text-white font-mono flex items-center gap-4">
              <span className="w-12 h-1 bg-accent"></span>
              Career Trajectory
            </h2>
            
            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-700 before:to-transparent">
              {EXPERIENCE.map((exp, index) => (
                <div key={exp.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-700 bg-dark shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                  </div>
                  
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-gray-600 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      {exp.logo && (
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1 shrink-0">
                          <img src={exp.logo} alt={exp.company} className="max-w-full max-h-full object-contain" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                          <h3 className="font-bold text-white text-lg leading-tight">{exp.role}</h3>
                          <span className="text-xs font-mono text-accent border border-accent/20 px-2 py-1 rounded bg-accent/5 mt-2 sm:mt-0 w-fit">
                            {exp.period}
                          </span>
                        </div>
                        <div className="text-sm font-mono text-gray-400 mb-4">{exp.company}</div>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mt-2">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
              <div>
                <h2 className="text-4xl font-bold text-white font-mono mb-2">Selected Work</h2>
                <p className="text-gray-500">A collection of technical challenges solved.</p>
              </div>
              <a href="https://github.com/mftnakrsu" target="_blank" className="text-accent hover:text-white transition-colors flex items-center gap-2 font-mono text-sm">
                View GitHub Profile <span className="text-lg">→</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {PROJECTS.map((project) => (
                <div key={project.id} className="group relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all duration-500">
                  <div className="aspect-video overflow-hidden relative">
                    <div className="absolute inset-0 bg-dark/20 group-hover:bg-transparent transition-colors z-10"></div>
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 filter grayscale group-hover:grayscale-0"
                    />
                  </div>
                  
                  <div className="p-8 relative z-20 bg-gray-900">
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 text-xs font-mono text-gray-300 bg-gray-800 rounded-md border border-gray-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-accent/5"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-[100px]"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white font-mono">
              Ready to Innovate?
            </h2>
            <p className="text-gray-400 mb-12 text-lg max-w-2xl mx-auto">
              I am currently open to discussing new opportunities in AI, Data Science, and Autonomous Systems.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <a 
                href={`mailto:${PROFILE.email}`}
                className="flex items-center gap-3 px-8 py-4 bg-accent hover:bg-cyan-600 text-dark rounded-full transition-all font-bold shadow-lg hover:shadow-accent/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                Send Email
              </a>
              <div className="flex gap-4">
                {PROFILE.socials.linkedin && (
                  <a href={PROFILE.socials.linkedin} target="_blank" rel="noreferrer" className="p-4 glass rounded-full hover:bg-white hover:text-black transition-all border border-gray-700">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                )}
                {PROFILE.socials.github && (
                  <a href={PROFILE.socials.github} target="_blank" rel="noreferrer" className="p-4 glass rounded-full hover:bg-white hover:text-black transition-all border border-gray-700">
                    <span className="sr-only">GitHub</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                )}
              </div>
            </div>
            
            <p className="mt-16 text-gray-600 text-xs font-mono">
              &copy; {new Date().getFullYear()} Mefby. Engineered with React & GenAI.
            </p>
          </div>
        </section>
      </main>

      <ChatBot />
    </div>
  );
};

export default App;