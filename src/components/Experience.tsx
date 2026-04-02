'use client'
import { Briefcase, Calendar } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { USER_DATA } from "@/constants/userData";
import { SECTION_DATA } from "@/constants/sectionData";

interface ExperienceItem {
  id: number;
  title: string;
  company: string;
  date: string;
  location: string;
  description: readonly string[];
}

const ExperienceCard = ({ item }: { item: ExperienceItem }) => {
  const cardRef = useIntersectionObserver<HTMLDivElement>()

  return (
    <div
      ref={cardRef} 
      className="animate-on-scroll bg-white p-6 rounded-xl shadow-md border-l-4 border-portfolio-accent mb-8"
    >
      <div className="flex flex-wrap justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-portfolio-blue">{item.title}</h3>
          <p className="text-lg text-portfolio-light-blue font-medium">{item.company}</p>
        </div>
        <div className="flex items-center text-gray-500 mt-2 sm:mt-0">
          <Calendar size={18} className="mr-1" />
          <span>{item.date}</span>
        </div>
      </div>
      
      <p className="text-gray-500 mb-4">{item.location}</p>
      
      <ul className="space-y-2">
        {item.description.map((point, index) => (
          <li key={index} className="flex">
            <span className="text-portfolio-accent mr-2">•</span>
            <span className="text-gray-600">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Experience = () => {
  return (
    <section id="experience" className="bg-white">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-portfolio-blue mb-4">
            {SECTION_DATA.experience.title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {SECTION_DATA.experience.subtitle}
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
            
            <div className="space-y-12">
              {USER_DATA.experience.map((item) => (
                <div key={item.id} className="relative pl-10">
                  <div className="absolute left-0 top-1.5 w-8 h-8 bg-portfolio-accent rounded-full flex items-center justify-center shadow-md">
                    <Briefcase size={16} className="text-white" />
                  </div>
                  <ExperienceCard item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
