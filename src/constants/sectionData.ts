export const SECTION_DATA = {
  hero: {
    title: "Hello, I'm",
    scrollText: "Scroll Down"
  },
  about: {
    title: "About Me"
  },
  experience: {
    title: "Work Experience",
    subtitle: "A chronicle of my professional journey and career highlights."
  },
  projects: {
    title: "Projects",
    subtitle: "Professional work and personal builds — real products used by real people.",
    filters: ["all", "professional", "personal"] as const
  },
  selfLearning: {
    title: "AI & Technical Growth",
    subtitle: "Staying ahead means investing in what's next. Here are the courses and self-directed programs I've completed — including AI-assisted development workflows that are now part of how I build.",
    filters: ["all", "Frontend", "Backend", "Cloud", "DevOps", "AI/ML"]
  },
  selfProjects: {
    title: "AI-Powered Projects",
    subtitle: "Projects I've built independently — applying AI-assisted workflows, modern full-stack patterns, and new tools to real problems.",
    filters: ["all", "Web Apps", "AI/ML", "Tools", "Games"]
  },
  skills: {
    title: "Tech Stack",
    subtitle: "Technologies and practices I use to build production software."
  },
  contact: {
    title: "Get In Touch",
    subtitle: "Have a question or want to work together? Feel free to reach out to me using the form below or through my contact information.",
    form: {
      name: {
        label: "Your Name",
        placeholder: "John Doe"
      },
      email: {
        label: "Your Email",
        placeholder: "john.doe@example.com"
      },
      subject: {
        label: "Subject",
        placeholder: "How can I help you?"
      },
      message: {
        label: "Message",
        placeholder: "Write your message here..."
      },
      submit: "Send Message",
      sending: "Sending..."
    },
    sections: {
      contactInfo: "Contact Information",
      resume: "Resume",
      followMe: "Follow Me"
    }
  },
  blog: {
    title: "Blog",
    subtitle: "Thoughts on agentic engineering, AI tools, and modern development."
  },
  footer: {
    links: {
      terms: "Terms",
      privacy: "Privacy",
      cookies: "Cookies"
    }
  }
} as const; 