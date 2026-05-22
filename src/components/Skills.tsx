import { USER_DATA } from "@/constants/userData";
import { SECTION_DATA } from "@/constants/sectionData";

const CATEGORIES = [
  { key: "frontend" as const,   label: "Frontend" },
  { key: "backend" as const,    label: "Backend" },
  { key: "cloudInfra" as const, label: "Cloud & Infra" },
  { key: "aiTooling" as const,  label: "AI & Tooling" },
  { key: "testing" as const,    label: "Testing" },
  { key: "practices" as const,  label: "Practices" },
];

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map(({ key, label }) => (
            <div key={key} className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-sm font-semibold text-portfolio-blue uppercase tracking-wider mb-4">
                {label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {USER_DATA.skills[key].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-50 text-portfolio-accent border border-blue-100 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
