'use client'
import Image from "next/image";
import { useState } from "react";
import { ExternalLink, Code } from "lucide-react";
import { USER_DATA } from "@/constants/userData";
import { SECTION_DATA } from "@/constants/sectionData";

interface Project {
  id: number;
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

const ProjectCard = ({ project }: { project: Project }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2">
    <div className="relative aspect-video overflow-hidden">
      <Image
        src={project.image}
        alt={project.title}
        fill
        className="object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-portfolio-blue mb-2">{project.title}</h3>
      <p className="text-gray-600 text-sm mb-2 line-clamp-3">{project.description}</p>
      {project.stat && (
        <p className="text-xs text-gray-400 font-medium mb-4">· {project.stat}</p>
      )}
      <div className="flex flex-wrap gap-2 mb-5">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="px-3 py-1 bg-blue-50 text-portfolio-accent rounded-full text-sm"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        {project.liveUrl && project.liveUrl !== '#' && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-portfolio-accent hover:text-portfolio-blue transition-colors text-sm font-medium"
          >
            <ExternalLink className="mr-1" size={14} />
            {project.liveUrlLabel ?? "Live Site"}
          </a>
        )}
        {project.codeUrl && project.codeUrl !== '#' ? (
          <a
            href={project.codeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-portfolio-accent hover:text-portfolio-blue transition-colors text-sm font-medium"
          >
            <Code className="mr-1" size={14} />
            View Code
          </a>
        ) : project.ndaNote ? (
          <span className="text-xs text-gray-400 italic">{project.ndaNote}</span>
        ) : null}
      </div>
    </div>
  </div>
);

const Projects = () => {
  type FilterType = typeof SECTION_DATA.projects.filters[number];
  const [filter, setFilter] = useState<FilterType>("all");

  const allProjects = USER_DATA.projects as unknown as Project[];
  const filteredProjects = allProjects.filter((p) =>
    filter === "all" ? true : p.category === filter
  );

  return (
    <section id="projects" className="bg-gray-50">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-portfolio-blue mb-4">
            {SECTION_DATA.projects.title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {SECTION_DATA.projects.subtitle}
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-2 mb-12">
          {SECTION_DATA.projects.filters.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-5 py-2 rounded-full transition-colors font-medium ${
                filter === item
                  ? "bg-portfolio-accent text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {filterLabels[item]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
