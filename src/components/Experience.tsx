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
      className="animate-on-scroll bg-white dark:bg-slate-800/40 p-6 rounded-xl border border-slate-200/60 dark:border-slate-700/50 border-l-4 border-l-blue-500 dark:border-l-blue-400 mb-8 shadow-sm"
    >
      <div className="flex flex-wrap justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">{item.title}</h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">{item.company}</p>
        </div>
        <div className="flex items-center text-slate-500 dark:text-slate-400 mt-2 sm:mt-0 gap-1">
          <Calendar size={16} />
          <span className="text-sm">{item.date}</span>
        </div>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">{item.location}</p>

      <ul className="space-y-2">
        {item.description.map((point, index) => (
          <li key={index} className="flex gap-2">
            <span className="text-blue-500 dark:text-blue-400 mt-0.5 shrink-0">•</span>
            <span className="text-slate-600 dark:text-slate-400 text-sm">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Experience = () => {
  return (
    <section id="experience" className="bg-[#f8fafc] dark:bg-[#0f172a]">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            {SECTION_DATA.experience.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {SECTION_DATA.experience.subtitle}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-0.5 bg-slate-200 dark:bg-slate-700"></div>

            <div className="space-y-12">
              {USER_DATA.experience.map((item) => (
                <div key={item.id} className="relative pl-10">
                  <div className="absolute left-0 top-1.5 w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center shadow-md">
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
