import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { USER_DATA } from "@/constants/userData";
import { SECTION_DATA } from "@/constants/sectionData";

const About = () => {
  return (
    <section id="about" className="bg-white">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
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
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl shadow-xl">
                <img 
                  src={USER_DATA.personal.image.url} 
                  alt={USER_DATA.personal.image.alt} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-portfolio-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
