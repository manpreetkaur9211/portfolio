import { useState, useEffect, useRef } from "react";
import { ExternalLink, Code } from "lucide-react";
import { USER_DATA } from "@/constants/userData";
import { SECTION_DATA } from "@/constants/sectionData";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: readonly string[];
  liveUrl: string;
  codeUrl: string;
}

const ProjectCard = ({ project }: { project: Project }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={cardRef} 
      className="animate-on-scroll bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2"
    >
      <div className="aspect-video overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
        <div className="flex space-x-4">
          <a 
            href={project.liveUrl}
            className="flex items-center text-portfolio-accent hover:text-portfolio-light-blue transition-colors"
          >
            <ExternalLink size={18} className="mr-1" />
            <span>Live Demo</span>
          </a>
          <a 
            href={project.codeUrl}
            className="flex items-center text-portfolio-accent hover:text-portfolio-light-blue transition-colors"
          >
            <Code size={18} className="mr-1" />
            <span>View Code</span>
          </a>
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
