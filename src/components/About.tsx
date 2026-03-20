import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { USER_DATA } from "@/constants/userData";
import { SECTION_DATA } from "@/constants/sectionData";

const About = () => {
  return (
    <section id="about" className="bg-white">
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-portfolio-blue mb-6">
            {SECTION_DATA.about.title}
          </h2>
          <div className="space-y-4 text-gray-600">
            {USER_DATA.about.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <div className="pt-6">
              <Button asChild className="bg-portfolio-accent hover:bg-portfolio-light-blue">
                <a href={USER_DATA.contact.resumePath} download={USER_DATA.contact.resumeFileName}>
                  <FileText className="mr-2" size={18} />
                  Download Resume
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
