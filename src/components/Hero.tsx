import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { USER_DATA } from "@/constants/userData";
import { SECTION_DATA } from "@/constants/sectionData";

const Hero = () => {
  return (
    <section id="top" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50 pt-16">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-portfolio-blue mb-6">
            <span className="text-slate-500">{SECTION_DATA.hero.title} </span>
            <span className="text-portfolio-accent">{USER_DATA.personal.name}</span>
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-portfolio-blue mb-8">
            {USER_DATA.personal.role}
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
            {USER_DATA.personal.introduction}
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button asChild className="bg-portfolio-accent hover:bg-portfolio-light-blue text-white px-6 py-6">
              <a href="#projects">View My Work</a>
            </Button>
            <Button asChild variant="outline" className="border-portfolio-accent text-portfolio-accent hover:bg-portfolio-accent/10 px-6 py-6">
              <a href="#contact">Contact Me</a>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#about" className="flex flex-col items-center text-sm text-gray-500">
            <span>{SECTION_DATA.hero.scrollText}</span>
            <ChevronDown className="mt-2" />
          </a>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-portfolio-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    </section>
  );
};

export default Hero;
