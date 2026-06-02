'use client'
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Code, Lock } from "lucide-react";
import { USER_DATA } from "@/constants/userData";
import { SECTION_DATA } from "@/constants/sectionData";

interface Project {
  id: number;
  isFeatured?: boolean;
  category: string;
  title: string;
  description: string;
  stat?: string;
  image: string;
  technologies: readonly string[];
  liveUrl?: string;
  liveUrlLabel?: string;
  codeUrl?: string;
  ndaNote?: string;
}

const filterLabels: Record<string, string> = {
  all: "All",
  professional: "Professional",
  personal: "Personal / AI",
};

const SchematicSVG = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 400 220"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* outer frame */}
    <rect x="10" y="10" width="380" height="200" rx="8" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 3" className="dark:stroke-slate-500" />
    {/* header bar */}
    <rect x="10" y="10" width="380" height="36" rx="8" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" className="dark:fill-slate-700 dark:stroke-slate-500" />
    <circle cx="30" cy="28" r="5" fill="#94a3b8" className="dark:fill-slate-500" />
    <circle cx="46" cy="28" r="5" fill="#94a3b8" className="dark:fill-slate-500" />
    <circle cx="62" cy="28" r="5" fill="#94a3b8" className="dark:fill-slate-500" />
    <rect x="80" y="20" width="80" height="16" rx="3" fill="#e2e8f0" className="dark:fill-slate-600" />
    {/* main content boxes */}
    <rect x="20" y="58" width="110" height="70" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" className="dark:fill-slate-700 dark:stroke-slate-500" />
    <rect x="30" y="66" width="50" height="8" rx="2" fill="#94a3b8" className="dark:fill-slate-500" />
    <rect x="30" y="80" width="88" height="6" rx="2" fill="#cbd5e1" className="dark:fill-slate-600" />
    <rect x="30" y="92" width="70" height="6" rx="2" fill="#cbd5e1" className="dark:fill-slate-600" />
    <rect x="30" y="104" width="80" height="6" rx="2" fill="#cbd5e1" className="dark:fill-slate-600" />
    {/* center column */}
    <rect x="148" y="58" width="104" height="32" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" className="dark:fill-slate-700 dark:stroke-slate-500" />
    <rect x="158" y="66" width="60" height="8" rx="2" fill="#94a3b8" className="dark:fill-slate-500" />
    <rect x="158" y="80" width="84" height="8" rx="2" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" className="dark:fill-slate-700 dark:stroke-slate-500" />
    <rect x="148" y="100" width="104" height="28" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" className="dark:fill-slate-700 dark:stroke-slate-500" />
    <rect x="158" y="108" width="60" height="6" rx="2" fill="#cbd5e1" className="dark:fill-slate-600" />
    {/* right box */}
    <rect x="270" y="58" width="110" height="70" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" className="dark:fill-slate-700 dark:stroke-slate-500" />
    <rect x="280" y="66" width="50" height="8" rx="2" fill="#94a3b8" className="dark:fill-slate-500" />
    <rect x="280" y="80" width="88" height="6" rx="2" fill="#cbd5e1" className="dark:fill-slate-600" />
    <rect x="280" y="92" width="70" height="6" rx="2" fill="#cbd5e1" className="dark:fill-slate-600" />
    <rect x="280" y="104" width="80" height="6" rx="2" fill="#cbd5e1" className="dark:fill-slate-600" />
    {/* connector lines */}
    <line x1="130" y1="93" x2="148" y2="93" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 2" className="dark:stroke-slate-500" />
    <line x1="252" y1="93" x2="270" y2="93" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 2" className="dark:stroke-slate-500" />
    <circle cx="200" cy="93" r="5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" className="dark:fill-slate-600 dark:stroke-slate-500" />
    {/* bottom row */}
    <rect x="20" y="148" width="360" height="6" rx="3" fill="#e2e8f0" className="dark:fill-slate-600" />
    <rect x="20" y="162" width="180" height="6" rx="3" fill="#e2e8f0" className="dark:fill-slate-600" />
    <rect x="20" y="176" width="240" height="6" rx="3" fill="#e2e8f0" className="dark:fill-slate-600" />
  </svg>
);

const NDABadge = () => (
  <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
    <Lock size={11} />
    NDA — code private
  </span>
);

const ActionButtons = ({ project }: { project: Project }) => (
  <div className="mt-auto pt-4 flex items-center gap-3 flex-wrap">
    {project.liveUrl && project.liveUrl !== '#' && (
      <a
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-80 transition-all duration-200"
      >
        <ExternalLink size={13} />
        {project.liveUrlLabel ?? "Live Site"}
      </a>
    )}
    {project.codeUrl && project.codeUrl !== '#' ? (
      <a
        href={project.codeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-blue-500/50 hover:text-portfolio-accent transition-all duration-200"
      >
        <Code size={13} />
        View Code
      </a>
    ) : project.ndaNote ? (
      <NDABadge />
    ) : null}
  </div>
);

const TechTags = ({ technologies }: { technologies: readonly string[] }) => (
  <div className="flex flex-wrap gap-1.5">
    {technologies.map((tech) => (
      <span
        key={tech}
        className="px-2 py-0.5 text-xs rounded-full bg-slate-100/80 text-slate-700 border border-slate-200/40 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
      >
        {tech}
      </span>
    ))}
  </div>
);

/** Parse "100M+ monthly rides · 15,000+ buses · 37+ cities" into [{value, label}, ...] */
const parseMetrics = (stat: string): { value: string; label: string }[] =>
  stat.split(' · ').map((part) => {
    const spaceIdx = part.indexOf(' ');
    if (spaceIdx === -1) return { value: part, label: '' };
    return { value: part.slice(0, spaceIdx), label: part.slice(spaceIdx + 1) };
  });

const FeaturedCard = ({ project }: { project: Project }) => {
  const metrics = project.stat ? parseMetrics(project.stat) : [];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/50 overflow-hidden hover:border-blue-500/30 hover:shadow-md transition-all duration-300">
      {/* Image area */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image src={project.image} alt={project.title} fill sizes="(max-width: 768px) 100vw, 66vw" className="object-cover" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">{project.title}</h3>

        {/* Metrics grid — each part of stat becomes its own column */}
        {metrics.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {metrics.map((m) => (
              <div key={m.value} className="flex flex-col">
                <span className="font-extrabold text-3xl leading-tight text-slate-900 dark:text-slate-50">
                  {m.value}
                </span>
                {m.label && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{m.label}</span>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
          {project.description}
        </p>

        <TechTags technologies={project.technologies} />
        <ActionButtons project={project} />
      </div>
    </div>
  );
};

const StandardCard = ({ project }: { project: Project }) => (
  <div className="h-full flex flex-col bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/50 overflow-hidden hover:border-blue-500/30 hover:shadow-md transition-all duration-300">
    {/* Image / schematic */}
    <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
      <Image
        src={project.image}
        alt={project.title}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>

    {/* Content */}
    <div className="flex flex-col flex-1 p-5">
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-0.5">{project.title}</h3>
      {project.stat && (
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">· {project.stat}</p>
      )}
      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-3">{project.description}</p>
      <TechTags technologies={project.technologies} />
      <ActionButtons project={project} />
    </div>
  </div>
);

const Projects = () => {
  type FilterType = typeof SECTION_DATA.projects.filters[number];
  const [filter, setFilter] = useState<FilterType>("all");

  const allProjects = USER_DATA.projects as unknown as Project[];
  const filtered = allProjects.filter((p) =>
    filter === "all" ? true : p.category === filter
  );

  // Interleave featured + standard so col-span-2 cards never sit adjacent
  const sorted: Project[] = [];
  const featured = filtered.filter((p) => p.isFeatured);
  const standard = filtered.filter((p) => !p.isFeatured);
  const maxLen = Math.max(featured.length, standard.length);
  for (let i = 0; i < maxLen; i++) {
    if (featured[i]) sorted.push(featured[i]);
    if (standard[i]) sorted.push(standard[i]);
    if (standard[i + featured.length - i - 1] && standard[i + featured.length - i - 1] !== standard[i]) {
      // extra standard cards fill naturally — handled by the loop continuing
    }
  }
  // Append any remaining standard cards not yet added
  standard.forEach((p) => { if (!sorted.includes(p)) sorted.push(p); });

  return (
    <section id="projects" className="bg-[#f8fafc] dark:bg-[#0f172a]">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            {SECTION_DATA.projects.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {SECTION_DATA.projects.subtitle}
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-2 mb-12">
          {SECTION_DATA.projects.filters.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-5 py-2 rounded-full transition-colors font-medium text-sm ${
                filter === item
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/50"
              }`}
            >
              {filterLabels[item]}
            </button>
          ))}
        </div>

        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(320px,_auto)]">
            {sorted.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className={project.isFeatured ? "md:col-span-2" : "md:col-span-1"}
              >
                {project.isFeatured
                  ? <FeaturedCard project={project} />
                  : <StandardCard project={project} />
                }
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Projects;
