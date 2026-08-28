/**
 * Site content. Single source of truth.
 * No fabricated data. No fake stats. No fake testimonials.
 * Aabir can edit this file to update the portfolio.
 */

export const site = {
  owner: {
    name: "Aabir Sharma",
    role: "AI/ML Engineer in Progress",
    education: "B.E. Computer Engineering, TIET",
    graduationYear: 2029,
    currentYear: 2,
    location: "Patiala, India",
    email: "asharma32_be25@thapar.edu",
    github: "https://github.com/Aabir265",
    linkedin: "https://www.linkedin.com/in/aabir-sharma-2296b3375/",
  },

  hero: {
    eyebrow: "Aabir Sharma · TIET · 2026",
    headline: ["I build AI systems", "and study what they learn."],
    emphasis: "what they learn",
    sub: "Computer engineering undergraduate. Machine learning, generative models, and the math underneath them.",
    cta: { label: "Read selected work", href: "#work" },
    secondary: { label: "View CV", href: "mailto:asharma32_be25@thapar.edu" },
  },

  about: {
    paragraphs: [
      "I am a second-year computer engineering student at Thapar Institute of Engineering and Technology, working at the intersection of machine learning, generative AI, and applied research.",
      "My work ranges from small Flask apps and ML models to research papers on Indian tax policy and gold-price market efficiency. I am interested in systems that learn, and in the math that explains why they learn.",
    ],
    focus: [
      "Artificial Intelligence",
      "Machine Learning",
      "Generative AI",
      "LLM Applications",
      "AI Agents",
      "DSA",
      "Research",
    ],
  },

  projects: [
    {
      id: "cafe-finder",
      number: "01",
      year: "2025",
      category: "Web App",
      title: "Cafe Finder",
      description:
        "A location-based café discovery web app. Real-time search, lightweight Flask API, designed to surface nearby cafés quickly.",
      stack: ["Flask", "Python", "HTML", "CSS", "JavaScript"],
      links: [
        { label: "Live", href: "https://cafe-finder-2.onrender.com/" },
        { label: "Source", href: "https://github.com/Aabir265" },
      ],
      visual: "web",
    },
    {
      id: "jee-score-predictor",
      number: "02",
      year: "2025",
      category: "ML",
      title: "JEE Score Predictor",
      description:
        "A regression model that predicts JEE Main scores from behavioral study data. Linear regression on a custom CSV, end-to-end preprocessing.",
      stack: ["Python", "Pandas", "NumPy", "Scikit-learn"],
      links: [{ label: "Source", href: "https://github.com/Aabir265" }],
      visual: "chart",
    },
    {
      id: "ai-yt-summarizer",
      number: "03",
      year: "2025",
      category: "AI App",
      title: "AI YouTube Video Summarizer",
      description:
        "A Gemini-powered system that fetches a YouTube transcript and returns key insights and a structured summary.",
      stack: ["Flask", "Python", "Gemini API", "YouTube API", "HTML", "CSS"],
      links: [{ label: "Source", href: "https://github.com/Aabir265" }],
      visual: "ai",
    },
    {
      id: "tic-tac-toe-cpp",
      number: "04",
      year: "2024",
      category: "C++",
      title: "Tic-Tac-Toe (C++)",
      description:
        "A console tic-tac-toe game built with classes, objects, 2D arrays, and game-state management. Object-oriented design, no shortcuts.",
      stack: ["C++", "OOP"],
      links: [{ label: "Source", href: "https://github.com/Aabir265" }],
      visual: "code",
    },
    {
      id: "placement-predictor",
      number: "05",
      year: "2026",
      category: "ML",
      title: "Student Placement Predictor",
      description:
        "A logistic regression classifier on the Indian Student Placement Dataset 2025. Predicts placement probability with full preprocessing, one-hot encoding, and feature scaling.",
      stack: ["Python", "Pandas", "NumPy", "Matplotlib", "Scikit-learn"],
      links: [{ label: "Source", href: "https://github.com/Aabir265" }],
      visual: "ml",
    },
  ],

  research: [
    {
      id: "gst-du",
      number: "01",
      title:
        "Assessing GST Revenue Buoyancy and Efficiency in India: Evidence from Advanced Econometric Models with Implications for MSMEs and Entrepreneurship",
      venue: "National Seminar on GST Reforms and Their Impact on MSMEs, Startups and Entrepreneurship",
      host: "University of Delhi",
      date: "2026-04-16",
      dateLabel: "16-17 Apr 2026",
      funding: "ICSSR",
      takeaway:
        "Empirically estimated GST revenue buoyancy across Indian states using advanced econometric models, with implications for MSME policy design.",
      links: [],
    },
    {
      id: "gst-iit-roorkee",
      number: "02",
      title:
        "Revisiting GST Revenue Buoyancy and Efficiency in India: An Innovation-Driven Perspective for Sustainable Growth and the Future of MSMEs",
      venue:
        "National Conference on Innovation, Future of Work and Sustainable Development",
      host: "Indian Institute of Technology Roorkee",
      date: "2026-05-03",
      dateLabel: "3 May 2026",
      funding: null,
      takeaway:
        "Extended the GST buoyancy analysis with an innovation-driven lens, linking tax efficiency to MSME sustainability outcomes.",
      links: [],
    },
    {
      id: "martingale-iit-madras",
      number: "03",
      title:
        "Market Efficiency of Gold Returns: A Martingale Difference Analysis in Developed and Emerging Currency Denominations",
      venue: "ICFMCF 2026",
      host: "Indian Institute of Technology Madras",
      date: "2026-07-04",
      dateLabel: "4 Jul 2026",
      funding: null,
      takeaway:
        "Tested the Martingale Difference Hypothesis on gold returns across developed and emerging currency denominations, examining weak-form market efficiency.",
      links: [],
    },
  ],

  experiments: {
    currentlyLearning: [
      "Deep Learning",
      "LLM Engineering",
      "RAGs",
      "Generative AI",
      "DSA in C++",
    ],
    competitiveProgramming: {
      platform: "CodeChef",
      note: "Solving rated problems on the side. Rating is real, will be linked when it is.",
    },
    recentActivity: [
      { date: "Aug 2026", label: "Built a 3D loss surface for this site" },
      { date: "Aug 2026", label: "Wrote a logistic regression pipeline for placement data" },
      { date: "Jun 2026", label: "Presented at ICFMCF 2026, IIT Madras" },
      { date: "May 2026", label: "Presented at IIT Roorkee national conference" },
      { date: "Apr 2026", label: "Presented at University of Delhi, ICSSR-funded" },
    ],
  },

  skills: [
    {
      group: "Languages",
      items: [
        { name: "Python", note: "primary language for ML and Flask work" },
        { name: "C++", note: "DSA, OOP, competitive programming" },
        { name: "JavaScript", note: "front-end glue, browser scripting" },
        { name: "HTML / CSS", note: "structure and styling" },
      ],
    },
    {
      group: "ML / Data",
      items: [
        { name: "Scikit-learn", note: "regression and classification models" },
        { name: "Pandas", note: "data wrangling" },
        { name: "NumPy", note: "numerical computation" },
        { name: "Matplotlib", note: "evaluation plots" },
      ],
    },
    {
      group: "Web / APIs",
      items: [
        { name: "Flask", note: "small API services and ML demos" },
        { name: "Gemini API", note: "summarization and LLM features" },
        { name: "YouTube Data API", note: "transcript retrieval" },
        { name: "Git / GitHub", note: "version control, project hosting" },
      ],
    },
    {
      group: "Currently Exploring",
      items: [
        { name: "Generative AI", note: "LLM applications and agents" },
        { name: "RAG", note: "retrieval-augmented pipelines" },
        { name: "TypeScript", note: "for this very site" },
        { name: "Three.js", note: "for the 3D research manifold" },
      ],
    },
  ],

  achievements: [
    {
      date: "2026-07-04",
      dateLabel: "Jul 2026",
      title: "Research Presentation at ICFMCF 2026",
      detail: "IIT Madras. Presented on gold-return market efficiency.",
    },
    {
      date: "2026-05-03",
      dateLabel: "May 2026",
      title: "Research Presentation at IIT Roorkee",
      detail:
        "National Conference on Innovation, Future of Work and Sustainable Development.",
    },
    {
      date: "2026-04-17",
      dateLabel: "Apr 2026",
      title:
        "Research Presentation at University of Delhi (ICSSR-funded)",
      detail:
        "Two-day National Seminar on GST Reforms and Their Impact on MSMEs, Startups and Entrepreneurship: Pathway to Viksit Bharat @2047.",
    },
  ],

  writing: [
    {
      title: "On the Martingale Difference Hypothesis",
      note: "Working notes from the ICFMCF 2026 paper.",
      status: "drafting",
    },
    {
      title: "A small note on logistic regression and placement data",
      note: "Companion to the Student Placement Predictor project.",
      status: "drafting",
    },
  ],

  contact: {
    invitation:
      "Open to research collaborations, ML engineering internships, and honest conversations about applied AI.",
    email: "asharma32_be25@thapar.edu",
    github: "https://github.com/Aabir265",
    linkedin: "https://www.linkedin.com/in/aabir-sharma-2296b3375/",
  },
} as const;

export type Site = typeof site;
