'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { USER_DATA } from "@/constants/userData";

const sectionLinks = [
  { title: "About", href: "#about" },
  { title: "Skills", href: "#skills" },
  { title: "AI & Learning", href: "#self-learning" },
  { title: "Personal Projects", href: "#self-projects" },
  { title: "Experience", href: "#experience" },
  { title: "Projects", href: "#projects" },
  { title: "Contact", href: "#contact" }
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // On non-home pages, section links go back to home first
  const sectionHref = (hash: string) => isHome ? hash : `/${hash}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="font-heading text-2xl font-bold text-portfolio-blue">
            Portfolio
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {sectionLinks.map((link) => (
              <a
                key={link.title}
                href={sectionHref(link.href)}
                className="font-medium text-gray-600 hover:text-portfolio-accent transition-colors"
              >
                {link.title}
              </a>
            ))}

            {/* Blog — separate route, not a hash anchor */}
            <Link
              href="/blog"
              className={`font-medium transition-colors ${
                pathname.startsWith('/blog')
                  ? 'text-portfolio-accent'
                  : 'text-gray-600 hover:text-portfolio-accent'
              }`}
            >
              Blog
            </Link>

            <Button asChild className="bg-portfolio-accent hover:bg-portfolio-light-blue">
              <a href={USER_DATA.contact.resumePath} download={USER_DATA.contact.resumeFileName}>
                Resume
              </a>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 animate-fade-in">
            <div className="flex flex-col space-y-4 px-4">
              {sectionLinks.map((link) => (
                <a
                  key={link.title}
                  href={sectionHref(link.href)}
                  className="font-medium text-gray-600 hover:text-portfolio-accent transition-colors py-2"
                  onClick={closeMenu}
                >
                  {link.title}
                </a>
              ))}

              <Link
                href="/blog"
                className={`font-medium transition-colors py-2 ${
                  pathname.startsWith('/blog')
                    ? 'text-portfolio-accent'
                    : 'text-gray-600 hover:text-portfolio-accent'
                }`}
                onClick={closeMenu}
              >
                Blog
              </Link>

              <Button asChild className="bg-portfolio-accent hover:bg-portfolio-light-blue w-full">
                <a href={USER_DATA.contact.resumePath} download={USER_DATA.contact.resumeFileName}>
                  Resume
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
