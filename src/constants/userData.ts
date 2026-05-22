export const USER_DATA = {
  personal: {
    name: "Manpreet Kaur",
    role: "Senior Full-Stack Engineer",
    introduction: "I build production-grade full-stack products — React, Next.js, Node.js, and LLM-powered pipelines that ship fast and scale.",
    image: {
      url: "manpreet.jpg",
      alt: "Manpreet Kaur"
    }
  },
  about: {
    paragraphs: [
      "I'm Manpreet — a Senior Full-Stack Engineer based in Melbourne with 10+ years building production platforms across healthcare, fintech, transportation, and AI.",
      "I've led frontend architecture across 4 simultaneous client platforms, mentored 13 engineers, and shipped products used by tens of millions of people — from Chalo's 100M+ monthly rides to Exly's creator economy platform.",
      "Right now I'm doing the most interesting work of my career: integrating LLM-powered pipelines into real production systems using Claude API and Vercel AI SDK at Yeyro — not prototypes, actual shipped features.",
      "I'm looking for my next senior or staff-level role where engineering quality, AI integration, and product impact go together. Open to Melbourne-based or remote opportunities with teams who care about both craft and shipping."
    ]
  },
  experience: [
    {
      id: 1,
      title: "Full-Stack Engineer",
      company: "Yeyro Pty Ltd",
      date: "Jul 2024 - Present",
      location: "Melbourne",
      description: [
        "Led AI integration — embedded LLM-powered automation (Claude API, Vercel AI SDK) into platform workflows to streamline operations and surface actionable health insights.",
        "Architected real-time notification engine using AWS SQS and WebSockets, improving alert latency for proactive health notifications.",
        "Built React 19 analytics dashboards visualising AI-generated health datasets for enterprise clients.",
        "Built Node.js health data processing backend integrating MongoDB and AWS for continuous wearable sensor ingestion."
      ]
    },
    {
      id: 2,
      title: "Senior Full-Stack Developer",
      company: "Daffodil Software Pvt Ltd",
      date: "Jun 2015 - Jun 2024",
      location: "Gurugram, India",
      description: [
        "Led frontend architecture across 4 simultaneous client platforms — healthcare, transportation, fintech, and automotive sectors.",
        "Mentored 13 engineers through code reviews, pair programming, and architecture coaching, improving team delivery velocity.",
        "Drove adoption of TDD, Agile/Scrum, and engineering best practices across cross-functional teams of 10+ engineers.",
        "Designed and implemented scalable REST API backends and microservices in Node.js, integrating across diverse tech stacks (Node.js, .NET, Java, C#)."
      ]
    }
  ],
  projects: [
    {
      id: 1,
      category: "professional",
      title: "Chalo",
      description: "India's #1 public transport platform — 100M+ monthly rides, 15,000+ buses, 37+ cities. Sole engineer on the GPS fleet tracking product; built real-time map visualisations with D3.js and Google Maps API, and led TMTU transport network management system from zero to production.",
      stat: "100M+ monthly rides · 15,000+ buses · 37+ cities",
      image: "https://chalo.com/assets/images/mock.png",
      technologies: ["Angular", "D3.js", "Google Maps API", "Node.js"],
      liveUrl: "https://chalo.com/",
      ndaNote: "NDA — code private"
    },
    {
      id: 2,
      category: "professional",
      title: "Exly",
      description: "India's fastest-growing creator economy platform ($6.2M funded). Primary React/Next.js engineer for the consumer-facing product; built the design system with React-Admin and Storybook adopted across a team of 4 engineers.",
      stat: "$6.2M funded · Design system adopted by 4 engineers",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3",
      technologies: ["React", "Next.js 15", "Material UI", "Node.js", "React-Admin", "Storybook"],
      liveUrl: "https://exly.in",
      ndaNote: "NDA — code private"
    },
    {
      id: 3,
      category: "professional",
      title: "Denso E-Audit",
      description: "Enterprise digital transformation for Denso Corporation — replaced a paper-based audit process with a live video and digital evidence system. Led full-stack delivery including Twilio integration for remote and face-to-face audit sessions.",
      stat: "Enterprise digital transformation · Automotive sector",
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3",
      technologies: ["React", "Node.js", "MongoDB", "AWS", "Twilio"],
      liveUrl: "https://www.daffodilsw.com/case-study/developing-compliance-management-software-solution/",
      liveUrlLabel: "Case Study",
      ndaNote: "NDA — code private"
    },
    {
      id: 4,
      category: "professional",
      title: "HEALTheia",
      description: "Telemedicine platform for eye care. Sole engineer across both patient and provider portals — built appointment scheduling, live video consultations (OpenTok/WebRTC), prescription management, and PubNub-powered async messaging.",
      stat: "Sole engineer · Patient + provider portals · Live video consultations",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3",
      technologies: ["Angular", "Node.js", "MongoDB", "PubNub", "OpenTok"],
      ndaNote: "NDA — code private"
    },
    {
      id: 5,
      category: "professional",
      title: "iBASEt",
      description: "Manufacturing process management platform for enterprise aerospace and defence clients — efficient tracking and management of complex production workflows.",
      stat: "Enterprise-scale · Manufacturing · Aerospace & Defence",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3",
      technologies: ["React", "React-lerna", "React-ind"],
      ndaNote: "NDA — code private"
    },
    {
      id: 6,
      category: "professional",
      title: "Reliance JIO",
      description: "Collaboration system for telecommunications network setup coordination across Reliance JIO's infrastructure rollout.",
      stat: "Enterprise-scale · Telecommunications",
      image: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Reliance_Jio_Logo.svg",
      technologies: ["Angular", "Bootstrap"],
      ndaNote: "NDA — code private"
    },
    {
      id: 7,
      category: "personal",
      title: "Full-Stack Demo Hub",
      description: "Four interactive demos built while learning modern full-stack patterns: Invoice Dashboard (Next.js 15 Server Components + PostgreSQL), Live Tractor Telemetry (WebSocket + Leaflet maps), Claude Research Agent (SSE streaming + AI), and Collaborative Whiteboard (Socket.IO + multi-user real-time).",
      stat: "4 interactive demos · Live WebSocket telemetry · Real-time collaboration",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3",
      technologies: ["Next.js 15", "Express", "PostgreSQL", "MongoDB", "Socket.IO", "Claude AI", "React-Leaflet", "JWT"],
      liveUrl: "https://pa-tawny.vercel.app/"
    },
    {
      id: 8,
      category: "personal",
      title: "Portfolio Hub",
      description: "Personal portfolio built end-to-end with AI-assisted development using Claude Code — prompt-driven UI, modern Next.js + TypeScript stack, and automated content workflows.",
      stat: "Built with Claude Code · Next.js 15 · Deployed on Vercel",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Claude Code"],
      codeUrl: "https://github.com/manpreetkaur9211"
    },
    {
      id: 9,
      category: "personal",
      title: "ClinScribe",
      description: "Real-time AI scribe for clinical consultations — speak during a patient session and get structured clinical notes instantly. Uses the Web Speech API for live transcription and Claude API to generate formatted notes from the transcript.",
      stat: "Built as a job application showcase · Live demo available",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3",
      technologies: ["Next.js", "Claude API", "Web Speech API", "TypeScript"],
      liveUrl: "https://scribe-black.vercel.app/",
      codeUrl: "https://github.com/manpreet-kaur9211/scribe"
    }
  ],
  selfLearning: {
    title: "Self Learning Journey",
    description: "Continuous learning is a key part of my professional growth. Here are some of the courses and certifications I've completed:",
    courses: [
      {
        id: 1,
        title: "Advanced TypeScript Patterns",
        platform: "Udemy",
        date: "2024",
        description: "Mastered advanced TypeScript patterns, decorators, and type manipulation techniques.",
        certificateUrl: "#",
        skills: ["TypeScript", "Design Patterns", "Advanced Types"]
      },
      {
        id: 2,
        title: "Advanced React Patterns",
        platform: "Frontend Masters",
        date: "2023",
        description: "Deep dive into React performance optimization, custom hooks, and advanced state management.",
        certificateUrl: "#",
        skills: ["React", "Performance", "State Management"]
      },
      {
        id: 3,
        title: "AI-Assisted Development",
        platform: "Self-Directed (Claude Code / Anthropic)",
        date: "2025",
        description: "Adopted AI pair programming with Claude Code — prompt-driven development, iterative vibe coding, and AI-accelerated full-stack workflows.",
        certificateUrl: "#",
        skills: ["Claude Code", "Prompt Engineering", "AI Pair Programming", "Vibe Coding"]
      }
    ]
  },
  selfProjects: {
    title: "Personal Projects",
    description: "These are projects I've built to explore new technologies and solve interesting problems:",
    projects: [
      {
        id: 1,
        title: "AI-Powered Task Manager",
        description: "A smart task management application that uses AI to prioritize and categorize tasks based on user behavior patterns.",
        image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3",
        technologies: ["React", "Node.js", "OpenAI API", "MongoDB"],
        liveUrl: "#",
        codeUrl: "#",
        features: ["AI-powered task prioritization", "Natural language task input", "Smart categorization", "Progress analytics"]
      },
      {
        id: 2,
        title: "Real-time Code Collaboration Platform",
        description: "A web-based platform for real-time code collaboration with features like syntax highlighting and version control integration.",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3",
        technologies: ["WebSocket", "React", "Node.js", "Redis"],
        liveUrl: "#",
        codeUrl: "#",
        features: ["Real-time code editing", "Multiple language support", "Git integration", "Chat functionality"]
      },
      {
        id: 3,
        title: "Personal Finance Dashboard",
        description: "A comprehensive financial dashboard that helps track expenses, investments, and financial goals with data visualization.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3",
        technologies: ["React", "D3.js", "Node.js", "PostgreSQL"],
        liveUrl: "#",
        codeUrl: "#",
        features: ["Expense tracking", "Investment portfolio analysis", "Financial goal setting", "Interactive charts"]
      },
      {
        id: 4,
        title: "Portfolio Hub",
        description: "Personal portfolio built end-to-end with AI-assisted development using Claude Code — vibe coding, prompt-driven UI, and a modern React + TypeScript stack.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3",
        technologies: ["React", "TypeScript", "Vite", "Tailwind CSS", "Claude Code"],
        liveUrl: "#",
        codeUrl: "https://github.com/manpreetkaur9211",
        features: ["AI-assisted development with Claude Code", "Responsive design with Tailwind CSS", "Scroll-triggered animations", "EmailJS contact form"]
      },
      {
        id: 5,
        title: "Full-Stack Demo Hub",
        description: "Four interactive demos built while learning modern full-stack patterns: Invoice Dashboard (Next.js 15 Server Components + PostgreSQL), Live Tractor Telemetry (WebSocket + Leaflet maps), Claude Research Agent (SSE streaming + AI), and Collaborative Whiteboard (Socket.IO + multi-user real-time).",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3",
        technologies: ["Next.js 15", "Express", "PostgreSQL", "MongoDB", "Socket.IO", "Claude AI", "React-Leaflet", "JWT"],
        liveUrl: "https://pa-tawny.vercel.app/",
        codeUrl: "#",
        features: [
          "Invoice Dashboard with Server Actions, Suspense streaming, and PostgreSQL",
          "Real-time GPS tracking on interactive Leaflet map via WebSocket",
          "Claude AI research agent with live web search and SSE streaming",
          "Multi-user collaborative whiteboard with Socket.IO and JWT auth"
        ]
      }
    ]
  },
  skills: {
    frontend: ["React", "Next.js", "Angular", "TypeScript", "Redux/RxJS", "HTML5/CSS"],
    backend: ["Node.js", "Express", "PostgreSQL", "MongoDB", "REST APIs"],
    cloudInfra: ["AWS", "Docker", "Firebase", "CI/CD"],
    aiTooling: ["Claude API", "Vercel AI SDK", "Prompt Engineering", "Claude Code"],
    testing: ["Jest", "React Testing Library", "Playwright"],
    practices: ["TDD", "Agile/Scrum", "Technical Mentoring", "Architecture Design"]
  },
  contact: {
    email: "manpreet.k9211@gmail.com",
    location: "Melbourne, Australia",
    resumePath: "/resume.pdf",
    resumeFileName: "Manpreet_Kaur_Resume.pdf",
    socialLinks: {
      github: "https://github.com/manpreetkaur9211",
      linkedin: "https://linkedin.com/in/kaurmanpreet921"
    } as {
      github: string;
      linkedin: string;
      twitter?: string;
    }
  }
};
