'use client';

import { useDesktopStore } from '@/store/desktop';
import { portfolioData } from '@/data/portfolio';
import { Code, Mail, ExternalLink } from 'lucide-react';

export default function PortfolioContent() {
  const locale = useDesktopStore((s) => s.locale);
  const isKo = locale === 'ko';
  const d = portfolioData;

  return (
    <div className="min-h-screen bg-gray-950 text-white" data-testid="portfolio-content">
      <section aria-label="hero" className="py-20 px-6 text-center border-b border-gray-800">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto mb-6 flex items-center justify-center text-3xl">
          👩‍💻
        </div>
        <h1 className="text-4xl font-bold mb-2">{isKo ? d.hero.name.ko : d.hero.name.en}</h1>
        <p className="text-xl text-blue-400 mb-3">{isKo ? d.hero.title.ko : d.hero.title.en}</p>
        <p className="text-gray-400">{isKo ? d.hero.tagline.ko : d.hero.tagline.en}</p>
      </section>

      <section aria-label="about" className="py-16 px-6 max-w-3xl mx-auto border-b border-gray-800">
        <h2 className="text-2xl font-bold mb-4">{isKo ? '소개' : 'About'}</h2>
        <p className="text-gray-300 leading-relaxed">{isKo ? d.about.ko : d.about.en}</p>
      </section>

      <section aria-label="tech stack" className="py-16 px-6 max-w-3xl mx-auto border-b border-gray-800">
        <h2 className="text-2xl font-bold mb-6">{isKo ? '기술 스택' : 'Tech Stack'}</h2>
        <div data-testid="tech-stack" className="flex flex-wrap gap-2">
          {d.techStack.map((tech) => (
            <span key={tech.name} className="px-3 py-1.5 bg-gray-800 text-blue-300 rounded-full text-sm border border-gray-700">
              {tech.name}
            </span>
          ))}
        </div>
      </section>

      <section aria-label="projects" className="py-16 px-6 max-w-4xl mx-auto border-b border-gray-800">
        <h2 className="text-2xl font-bold mb-6">{isKo ? '프로젝트' : 'Projects'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {d.projects.map((project) => (
            <div key={project.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{isKo ? project.description.ko : project.description.en}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.tech.map((t) => (
                  <span key={t} className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-xs">{t}</span>
                ))}
              </div>
              {project.link && (
                <a href={project.link} className="text-blue-400 text-sm hover:underline inline-flex items-center gap-1">
                  <ExternalLink size={14} /> {isKo ? '보기' : 'View'}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section aria-label="contact" className="py-16 px-6 text-center">
        <h2 className="text-2xl font-bold mb-6">{isKo ? '연락처' : 'Contact'}</h2>
        <div className="flex justify-center gap-6">
          {d.contact.github && (
            <a href={d.contact.github} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
              <Code size={20} /> GitHub
            </a>
          )}
          {d.contact.email && (
            <a href={`mailto:${d.contact.email}`} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
              <Mail size={20} /> Email
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
