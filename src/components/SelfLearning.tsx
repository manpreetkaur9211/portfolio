import { useEffect, useRef } from "react";
import { Award, ExternalLink } from "lucide-react";
import { USER_DATA } from "@/constants/userData";
import { SECTION_DATA } from "@/constants/sectionData";

interface Course {
  id: number;
  title: string;
  platform: string;
  date: string;
  description: string;
  certificateUrl: string;
  skills: readonly string[];
}

const SelfLearning = () => {
  const sectionRef = useRef<HTMLElement>(null);

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

  return (
    <section id="self-learning" ref={sectionRef} className="bg-gray-50 animate-on-scroll">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-portfolio-blue mb-4">
            {SECTION_DATA.selfLearning.title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {SECTION_DATA.selfLearning.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {USER_DATA.selfLearning.courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-portfolio-blue">
                    {course.title}
                  </h3>
                  <Award className="text-portfolio-accent" size={24} />
                </div>
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-500">
                    {course.platform}
                  </span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm font-medium text-gray-500">
                    {course.date}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <a
                  href={course.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-portfolio-accent hover:text-portfolio-blue transition-colors"
                >
                  View Certificate
                  <ExternalLink className="ml-2" size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelfLearning; 