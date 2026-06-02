import { FileText } from "lucide-react";
import { USER_DATA } from "@/constants/userData";
import { SECTION_DATA } from "@/constants/sectionData";

const About = () => {
  return (
    <section id="about" className="bg-white dark:bg-[#0f172a]">
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-6">
            {SECTION_DATA.about.title}
          </h2>
          <div className="space-y-4 text-slate-600 dark:text-slate-400">
            {USER_DATA.about.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <div className="pt-6">
              <a
                href={USER_DATA.contact.resumePath}
                download={USER_DATA.contact.resumeFileName}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 hover:-translate-y-0.5 transition-all duration-300"
              >
                <FileText size={16} />
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
