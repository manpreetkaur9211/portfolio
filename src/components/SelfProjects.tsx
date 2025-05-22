import { useEffect, useRef, useState } from "react";
import { ExternalLink, Code, ChevronDown } from "lucide-react";
import { USER_DATA } from "@/constants/userData";
import { SECTION_DATA } from "@/constants/sectionData";

interface SelfProject {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: readonly string[];
  liveUrl: string;
  codeUrl: string;
  features: readonly string[];
}

const SelfProjects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const filteredProjects = USER_DATA.selfProjects.projects.filter((project) => {
    if (activeFilter === "all") return true;
    return project.technologies.some((tech) =>
      tech.toLowerCase().includes(activeFilter.toLowerCase())
    );
  });

  const toggleProject = (projectId: number) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  return (
    <section id="self-projects" ref={sectionRef} className="bg-white animate-on-scroll">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-portfolio-blue mb-4">
            {SECTION_DATA.selfProjects.title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {SECTION_DATA.selfProjects.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {SECTION_DATA.selfProjects.filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? "bg-portfolio-accent text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative aspect-video">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/20 text-white rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                <button
                  onClick={() => toggleProject(project.id)}
                  className="flex items-center text-portfolio-accent hover:text-portfolio-blue transition-colors mb-4"
                >
                  <span>View Features</span>
                  <ChevronDown
                    className={`ml-2 transition-transform ${
                      expandedProject === project.id ? "rotate-180" : ""
                    }`}
                    size={16}
                  />
                </button>

                {expandedProject === project.id && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Key Features:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {project.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-4">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-portfolio-accent hover:text-portfolio-blue transition-colors"
                  >
                    <ExternalLink className="mr-2" size={16} />
                    Live Demo
                  </a>
                  <a
                    href={project.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-portfolio-accent hover:text-portfolio-blue transition-colors"
                  >
                    <Code className="mr-2" size={16} />
                    View Code
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelfProjects; 