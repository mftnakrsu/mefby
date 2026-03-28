import React from 'react';
import ChatBot from './components/ChatBot';
import { EXPERIENCE, PROJECTS, PROFILE, PUBLICATIONS, EDUCATION, CERTIFICATIONS, WRITING } from './constants';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-zinc-500 font-sans">
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">

        {/* Header */}
        <header className="mb-20">
          <img src="/profile.jpg" alt="Meftun Akarsu" className="w-28 h-28 rounded-full object-cover mb-6 ring-4 ring-emerald-400 ring-offset-4 ring-offset-white" />
          <h1 className="text-2xl font-semibold text-zinc-900 mb-3">Meftun Akarsu</h1>
          <p className="text-base leading-relaxed mb-6">
            {PROFILE.bio}
          </p>

          {/* Education - inline */}
          <div className="text-sm space-y-1 mb-6">
            {EDUCATION.map(edu => (
              <p key={edu.id} className="text-zinc-500">
                {edu.degree}, {edu.school}{edu.gpa ? ` (${edu.gpa})` : ''}
              </p>
            ))}
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4 text-sm">
            {PROFILE.socials.github && (
              <a href={PROFILE.socials.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-emerald-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </a>
            )}
            {PROFILE.socials.linkedin && (
              <a href={PROFILE.socials.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-emerald-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                LinkedIn
              </a>
            )}
            <a href={`mailto:${PROFILE.email}`} className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-emerald-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              {PROFILE.email}
            </a>
            <a href="https://medium.com/@meftunakarsu" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-emerald-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>
              Blog
            </a>
          </div>
        </header>

        {/* Experience */}
        <section className="mb-20">
          <h2 className="text-xs font-medium text-zinc-600 uppercase tracking-widest mb-8">Experience</h2>
          <div className="space-y-6">
            {EXPERIENCE.map(exp => (
              <div key={exp.id} className="group">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-0">
                  <span className="text-xs text-zinc-600 sm:w-44 shrink-0 font-mono">{exp.period}</span>
                  <div>
                    <span className="text-sm text-zinc-900">{exp.role}</span>
                    <span className="text-sm text-zinc-600"> — {exp.company}</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-600 mt-1.5 sm:ml-44 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-20">
          <h2 className="text-xs font-medium text-zinc-600 uppercase tracking-widest mb-8">Selected Work</h2>
          <div className="space-y-8">
            {PROJECTS.map(project => (
              <div key={project.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-sm text-zinc-900 font-medium">{project.title}</h3>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noreferrer" className="text-xs text-zinc-600 hover:text-emerald-600 shrink-0">
                      link &rarr;
                    </a>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-x-2 gap-y-1 mt-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[11px] text-zinc-600">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Writing */}
        <section className="mb-20">
          <h2 className="text-xs font-medium text-zinc-600 uppercase tracking-widest mb-8">Writing</h2>
          <div className="space-y-4">
            {WRITING.map((post, i) => (
              <a key={i} href={post.url} target="_blank" rel="noreferrer" className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 group">
                <span className="text-sm text-zinc-500 group-hover:text-emerald-600 transition-colors">{post.title}</span>
                <span className="text-xs text-zinc-400 font-mono shrink-0">{post.date}</span>
              </a>
            ))}
          </div>
          <a href="https://medium.com/@meftunakarsu" target="_blank" rel="noreferrer" className="inline-block mt-6 text-xs text-zinc-400 hover:text-emerald-600 transition-colors">
            all posts &rarr;
          </a>
        </section>

        {/* Publications */}
        <section className="mb-20">
          <h2 className="text-xs font-medium text-zinc-600 uppercase tracking-widest mb-8">Publications</h2>
          <div className="space-y-5">
            {PUBLICATIONS.map(pub => (
              <div key={pub.id} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-0">
                <span className="text-xs text-zinc-400 sm:w-16 shrink-0 font-mono">{pub.year}</span>
                <div className="flex-1">
                  {pub.link ? (
                    <a href={pub.link} target="_blank" rel="noreferrer" className="text-sm text-zinc-400 hover:text-emerald-600 leading-snug">
                      {pub.title}
                    </a>
                  ) : (
                    <span className="text-sm text-zinc-400 leading-snug">{pub.title}</span>
                  )}
                  <span className="text-xs text-zinc-600 ml-2">{pub.venue}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-20">
          <h2 className="text-xs font-medium text-zinc-600 uppercase tracking-widest mb-6">Certifications</h2>
          <div className="space-y-1.5">
            {CERTIFICATIONS.map((cert, i) => (
              <p key={i} className="text-xs text-zinc-600">{cert}</p>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-zinc-200">
          <p className="text-xs text-zinc-400">&copy; {new Date().getFullYear()} Meftun Akarsu</p>
        </footer>

      </div>

      <ChatBot />
    </div>
  );
};

export default App;
