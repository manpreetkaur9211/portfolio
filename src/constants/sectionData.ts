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
    title: "My Projects",
    subtitle: "Explore some of my key projects. Each project showcases different technologies and demonstrates my expertise in both frontend and backend development.",
    filters: ["all", "React", "Angular", "Node.js", "MongoDB", "AWS"]
  },
  selfLearning: {
    title: "Self Learning Journey",
    subtitle: "Continuous learning is a key part of my professional growth. Here are some of the courses and certifications I've completed.",
    filters: ["all", "Frontend", "Backend", "Cloud", "DevOps", "AI/ML"]
  },
  selfProjects: {
    title: "Personal Projects",
    subtitle: "These are projects I've built to explore new technologies and solve interesting problems.",
    filters: ["all", "Web Apps", "AI/ML", "Tools", "Games"]
  },
  skills: {
    title: "My Skills",
    subtitle: "With 9 years of experience specializing in front-end and back-end development, I've developed expertise in a variety of technologies across the full stack spectrum.",
    categories: {
      frontend: {
        title: "Frontend Development"
      },
      backend: {
        title: "Backend Development"
      },
      other: {
        title: "Other Skills"
      }
    }
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
  footer: {
    links: {
      terms: "Terms",
      privacy: "Privacy",
      cookies: "Cookies"
    }
  }
} as const; 