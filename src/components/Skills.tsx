'use client'
import { useEffect, useRef, useState } from "react";
import { USER_DATA } from "@/constants/userData";
import { SECTION_DATA } from "@/constants/sectionData";

interface Skill {
  name: string;
  percentage: number;
  color: string;
}

const SkillBar = ({ skill }: { skill: Skill }) => {
  const [width, setWidth] = useState(0);
  const skillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setWidth(skill.percentage);
          }, 300);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (skillRef.current) {
      observer.observe(skillRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [skill.percentage]);

  return (
    <div ref={skillRef} className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{skill.name}</span>
        <span className="text-sm font-medium text-gray-700">{skill.percentage}%</span>
      </div>
      <div className="progress-bar">
        <div 
          className={`progress-bar-fill ${skill.color}`} 
          style={{ width: `${width}%` }} 
        />
      </div>
    </div>
  );
};

const Skills = () => {
  return (
    <section id="skills" className="bg-gray-50">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-portfolio-blue mb-4">
            {SECTION_DATA.skills.title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {SECTION_DATA.skills.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-6 text-portfolio-blue">{SECTION_DATA.skills.categories.frontend.title}</h3>
            {USER_DATA.skills.frontend.map((skill) => (
              <SkillBar key={skill.name} skill={skill} />
            ))}
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-6 text-portfolio-blue">{SECTION_DATA.skills.categories.backend.title}</h3>
            {USER_DATA.skills.backend.map((skill) => (
              <SkillBar key={skill.name} skill={skill} />
            ))}
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-6 text-portfolio-blue">{SECTION_DATA.skills.categories.other.title}</h3>
            {USER_DATA.skills.other.map((skill) => (
              <SkillBar key={skill.name} skill={skill} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
