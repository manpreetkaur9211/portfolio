import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { USER_DATA } from "@/constants/userData";
import { SECTION_DATA } from "@/constants/sectionData";

const TechCloud = () => (
  <div className="relative pt-4">
    {/* CSS cloud puffs — purely decorative, behind icons */}
    <div className="absolute inset-x-0 bottom-0 top-4 bg-blue-100 dark:bg-slate-700 rounded-2xl" />
    <div className="absolute -top-1 left-4 w-10 h-10 bg-blue-100 dark:bg-slate-700 rounded-full" />
    <div className="absolute top-0 left-12 w-14 h-12 bg-blue-100 dark:bg-slate-700 rounded-full" />
    <div className="absolute -top-1 right-8 w-10 h-10 bg-blue-100 dark:bg-slate-700 rounded-full" />
    {/* Icons */}
    <div className="relative z-10 flex items-center gap-2.5 px-4 py-3">
      <div className="w-9 h-9 rounded-full bg-black dark:bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
        <svg viewBox="0 0 180 180" className="w-5 h-5" aria-label="Next.js">
          <mask id="hero-mask-nextjs" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
            <circle cx="90" cy="90" r="90" fill="black" />
          </mask>
          <g mask="url(#hero-mask-nextjs)">
            <circle cx="90" cy="90" r="90" fill="black" />
            <path d="M149.508 157.52L69.142 54H54V125.97H66.1V69.3L139.142 164.85C142.604 162.482 146.078 160.032 149.508 157.52Z" fill="url(#hero-grad-a)" />
            <rect x="115" y="54" width="12" height="72" fill="url(#hero-grad-b)" />
          </g>
          <defs>
            <linearGradient id="hero-grad-a" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" /><stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="hero-grad-b" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" /><stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="w-9 h-9 rounded-full bg-black dark:bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
        <svg viewBox="0 0 116 100" className="w-4 h-4 fill-white dark:fill-black" aria-label="Vercel">
          <path d="M57.5 0L115 100H0L57.5 0z" />
        </svg>
      </div>
      <div className="w-9 h-9 rounded-full bg-[#20232a] flex items-center justify-center flex-shrink-0 shadow-sm">
        <svg viewBox="0 0 100 100" className="w-5 h-5" aria-label="React">
          <circle cx="50" cy="50" r="8" fill="#61DAFB" />
          <ellipse cx="50" cy="50" rx="45" ry="16" fill="none" stroke="#61DAFB" strokeWidth="4" />
          <ellipse cx="50" cy="50" rx="45" ry="16" fill="none" stroke="#61DAFB" strokeWidth="4" transform="rotate(60 50 50)" />
          <ellipse cx="50" cy="50" rx="45" ry="16" fill="none" stroke="#61DAFB" strokeWidth="4" transform="rotate(120 50 50)" />
        </svg>
      </div>
      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">AI</span>
    </div>
  </div>
);

const RingFrame = () => (
  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
    {/* Outer dashed ring */}
    <circle cx="150" cy="150" r="138" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 5" className="dark:stroke-slate-700" />
    {/* Main solid ring */}
    <circle cx="150" cy="150" r="118" fill="none" stroke="#94a3b8" strokeWidth="1.5" className="dark:stroke-slate-600" />
    {/* Tick marks every 30° */}
    {Array.from({ length: 12 }).map((_, i) => {
      const angle = (i * 30 * Math.PI) / 180;
      const isCardinal = i % 3 === 0;
      const innerR = isCardinal ? 106 : 112;
      const outerR = 124;
      return (
        <line
          key={i}
          x1={150 + innerR * Math.sin(angle)}
          y1={150 - innerR * Math.cos(angle)}
          x2={150 + outerR * Math.sin(angle)}
          y2={150 - outerR * Math.cos(angle)}
          stroke={isCardinal ? "#94a3b8" : "#cbd5e1"}
          strokeWidth={isCardinal ? 2 : 1}
          strokeLinecap="round"
          className={isCardinal ? "dark:stroke-slate-500" : "dark:stroke-slate-600"}
        />
      );
    })}
    {/* Dots at cardinal points on outer ring */}
    {[0, 90, 180, 270].map((deg) => {
      const angle = (deg * Math.PI) / 180;
      return (
        <circle
          key={deg}
          cx={150 + 134 * Math.sin(angle)}
          cy={150 - 134 * Math.cos(angle)}
          r="3"
          fill="#94a3b8"
          className="dark:fill-slate-600"
        />
      );
    })}
  </svg>
);

const Hero = () => {
  return (
    <section
      id="top"
      className="relative min-h-[90vh] flex flex-col justify-center pt-28 pb-16 md:pt-32 md:pb-20 bg-white dark:bg-[#0f172a] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left: Text — col-span-7 */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {SECTION_DATA.hero.titleLine1}{" "}
              <span className="text-portfolio-accent dark:text-blue-400">{SECTION_DATA.hero.titleLine2}</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              {USER_DATA.personal.introduction}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button asChild className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 hover:-translate-y-0.5 transition-all duration-300 px-6 py-6">
                <a href="#projects">View My Work</a>
              </Button>
              <Button asChild variant="outline" className="border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-300 px-6 py-6">
                <a href="#contact">Contact Me</a>
              </Button>
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              <a href={USER_DATA.contact.socialLinks.github} target="_blank" rel="noopener noreferrer"
                className="bg-slate-200 hover:bg-slate-900 hover:text-white text-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-100 dark:hover:text-slate-900 p-3 rounded-full transition-all duration-200"
                aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href={USER_DATA.contact.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                className="bg-slate-200 hover:bg-slate-900 hover:text-white text-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-100 dark:hover:text-slate-900 p-3 rounded-full transition-all duration-200"
                aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right: Cloud + Ring + Avatar — col-span-5 */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <div className="flex items-center gap-0">
              {/* Tech cloud */}
              <div className="mb-8 self-end">
                <TechCloud />
              </div>
              {/* Ring frame with avatar + availability capsule pinned to bottom-center */}
              <div className="w-64 h-64 md:w-72 md:h-72 relative flex items-center justify-center">
                <RingFrame />
                <div className="relative z-10 w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden">
                  <Image
                    src={`/${USER_DATA.personal.image.url}`}
                    alt={USER_DATA.personal.image.alt}
                    width={256}
                    height={256}
                    className="w-full h-full object-cover grayscale"
                    priority
                  />
                </div>
                {/* Available badge — bottom-center of the ring circle */}
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50 shadow-sm whitespace-nowrap">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Available
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#about" className="flex flex-col items-center text-sm text-slate-500 dark:text-slate-400">
          <span>{SECTION_DATA.hero.scrollText}</span>
          <ChevronDown className="mt-1" size={20} />
        </a>
      </div>
    </section>
  );
};

export default Hero;
