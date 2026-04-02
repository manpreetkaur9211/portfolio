'use client'
import Image from "next/image";
import { useState } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { ExternalLink, Code } from "lucide-react";
import { USER_DATA } from "@/constants/userData";
import { SECTION_DATA } from "@/constants/sectionData";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: readonly string[];
  liveUrl?: string;
  codeUrl?: string;
}

const ProjectCard = ({ project }: { project: Project }) => {
  const cardRef = useIntersectionObserver<HTMLDivElement>()

  return (
    <div
      ref={cardRef}
      className="animate-on-scroll bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-portfolio-blue mb-2">
          {project.title}
        </h3>
        <p className="text-gray-600 mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tech) => (
            <span 
              key={tech} 
              className="px-3 py-1 bg-blue-50 text-portfolio-accent rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      
      </div>
    </div>
  );
};

const Projects = () => {
  type FilterType = typeof SECTION_DATA.projects.filters[number];
  const [filter, setFilter] = useState<FilterType>("all");
  
  const filteredProjects = USER_DATA.projects.filter((project) => {
    if (filter === "all") return true;
    return project.technologies.some(tech => tech.toLowerCase() === filter.toLowerCase());
  });

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
              className={`px-4 py-2 rounded-full transition-colors ${
                filter === item 
                  ? "bg-portfolio-accent text-white" 
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item === "all" ? "All" : item}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
