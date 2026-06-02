import React from "react";
import { ChevronDown } from "lucide-react";
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

const BRAND_LOGOS: Record<string, React.ReactNode> = {
  "React": (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <circle cx="8" cy="8" r="1.5" fill="#61DAFB" />
      <ellipse cx="8" cy="8" rx="7" ry="2.8" fill="none" stroke="#61DAFB" strokeWidth="1" />
      <ellipse cx="8" cy="8" rx="7" ry="2.8" fill="none" stroke="#61DAFB" strokeWidth="1" transform="rotate(60 8 8)" />
      <ellipse cx="8" cy="8" rx="7" ry="2.8" fill="none" stroke="#61DAFB" strokeWidth="1" transform="rotate(120 8 8)" />
    </svg>
  ),
  "Next.js": (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <rect width="16" height="16" rx="3" fill="black" />
      <path d="M9.5 4.5H11v7h-1.2L5.5 6.2V11.5H4v-7h1.3l4.2 5.8V4.5z" fill="white" />
    </svg>
  ),
  "TypeScript": (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <rect width="16" height="16" rx="2" fill="#3178C6" />
      <text x="8" y="12" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white" fontFamily="Arial, sans-serif">TS</text>
    </svg>
  ),
  "Angular": (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <polygon points="8,1 15,4 13.5,12 8,15 2.5,12 1,4" fill="#DD0031" />
      <polygon points="8,1 8,15 13.5,12 15,4" fill="#C3002F" />
      <path d="M8,3.5 L5,10.5h1.5l.6-1.5h1.8l.6,1.5H11L8,3.5zm0,2.2l.7,1.8H7.3L8,5.7z" fill="white" />
    </svg>
  ),
  "Node.js": (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M8 1L1.5 4.7v6.6L8 15l6.5-3.7V4.7L8 1z" fill="#339933" />
      <path d="M8 3.2L4 5.5v5L8 13l4-2.5v-5L8 3.2zM9.3 10.2c-.2.3-.5.5-.9.6-.4.1-.8 0-1.1-.2l.4-.7c.2.1.4.2.6.1.2 0 .3-.1.4-.3.1-.2.1-.5.1-.9V6.2H10v3C10 9.6 9.7 10 9.3 10.2z" fill="white" />
    </svg>
  ),
  "PostgreSQL": (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <ellipse cx="8" cy="5" rx="5" ry="3" fill="#336791" />
      <path d="M3 5v6c0 1.7 2.2 3 5 3s5-1.3 5-3V5" fill="none" stroke="#336791" strokeWidth="1.5" />
      <path d="M13 5c0 1.7-2.2 3-5 3S3 6.7 3 5" fill="#336791" />
    </svg>
  ),
  "MongoDB": (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M8 1c0 0-4 5-4 8.5a4 4 0 0 0 8 0C12 6 8 1 8 1z" fill="#47A248" />
      <line x1="8" y1="13" x2="8" y2="15" stroke="#47A248" strokeWidth="1.5" />
    </svg>
  ),
  "AWS": (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <text x="1" y="10" fontSize="6" fontWeight="bold" fill="#FF9900" fontFamily="Arial, sans-serif">AWS</text>
      <path d="M2 12 Q8 15 14 12" fill="none" stroke="#FF9900" strokeWidth="1.2" />
    </svg>
  ),
  "Docker": (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <rect x="1" y="6" width="3" height="2.5" rx="0.3" fill="#2496ED" />
      <rect x="4.5" y="6" width="3" height="2.5" rx="0.3" fill="#2496ED" />
      <rect x="8" y="6" width="3" height="2.5" rx="0.3" fill="#2496ED" />
      <rect x="4.5" y="3" width="3" height="2.5" rx="0.3" fill="#2496ED" />
      <rect x="8" y="3" width="3" height="2.5" rx="0.3" fill="#2496ED" />
      <path d="M12 9c.5-1.5 2-1 2-1s.5 2-1 3H2c-1-1-.5-3 1-3 0-1 1-2 2-1.5" fill="none" stroke="#2496ED" strokeWidth="0.8" />
    </svg>
  ),
  "Claude API": (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="#CC785C" />
      <text x="8" y="11.5" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white" fontFamily="Arial, sans-serif">C</text>
    </svg>
  ),
  "Vercel AI SDK": (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <polygon points="8,2 15,13 1,13" fill="black" className="dark:fill-white" />
    </svg>
  ),
  "Jest": (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="#C21325" />
      <text x="8" y="11.5" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white" fontFamily="Arial, sans-serif">J</text>
    </svg>
  ),
  "Playwright": (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="#2EAD33" />
      <text x="8" y="11.5" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white" fontFamily="Arial, sans-serif">P</text>
    </svg>
  ),
};

function getBrandLogo(skill: string) {
  return BRAND_LOGOS[skill] ?? null;
}

const Skills = () => {
  return (
    <section id="skills" className="bg-[#f8fafc] dark:bg-[#0f172a]">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            {SECTION_DATA.skills.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {SECTION_DATA.skills.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map(({ key, label }) => {
            const isAiTooling = key === "aiTooling";
            return (
              <div
                key={key}
                className={[
                  "bg-white dark:bg-slate-800/40",
                  "border border-slate-200/60 dark:border-slate-700/50",
                  "rounded-xl p-6",
                  isAiTooling
                    ? "shadow-[0_0_25px_rgba(168,85,247,0.05)] dark:shadow-[0_0_30px_rgba(168,85,247,0.12)]"
                    : "",
                ].join(" ")}
              >
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
                  {label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {USER_DATA.skills[key].map((skill) => {
                    const logo = getBrandLogo(skill);
                    return (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100/80 text-slate-700 border border-slate-200/40 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 rounded-full text-sm hover:border-blue-400/50 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:border-blue-500/40 transition-colors duration-200"
                      >
                        {logo}
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter by Practice — decorative UI element matching reference image */}
        <div className="flex justify-center mt-8">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 hover:border-slate-300 transition-colors">
            Filter by Practice <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Skills;
