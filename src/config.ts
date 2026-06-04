export const siteConfig = {
  name: "Kavan Tsang",
  title: "Undergraduate Student, Chemical Engineering & Biomedical Engineering, Carnegie Mellon University",
  description:
    "Portfolio website of Kavan Tsang, undergraduate student at Carnegie Mellon University studying Chemical Engineering and Biomedical Engineering.",
  accentColor: "#2563eb",
  social: {
    // Email intentionally omitted — contact happens via the form (Contact.astro)
    // to avoid exposing the address to scrapers.
    linkedin: "https://www.linkedin.com/in/kavantsang/",
    researchgate: "",
    scholar: "",
    github: "",
  },
  aboutMe:
    "I'm an undergraduate at Carnegie Mellon studying Chemical Engineering and Biomedical Engineering. I currently do research with the Wood Neuro Research Group, where I work with EEG recordings and multimodal participant data. I also interned at ExoRenal, where I helped test and evaluate dialysis-related medical devices in a lab setting. I'm drawn to problems that sit at the boundary of engineering and biology, especially ones involving data analysis, fluid systems, or medical device development.",
  skills: [
    "Python",
    "NumPy / Pandas / SciPy / Matplotlib",
    "MATLAB",
    "HTML",
    "COMSOL Multiphysics",
    "Aspen Plus",
    "AutoCAD",
    "Microsoft Excel",
    "EEG data processing",
    "Signal processing",
    "Fluid systems modeling",
    "English & Cantonese",
  ],
  projects: [
    {
      name: "Chlorine Residual Modeling of Oakland",
      description:
        "Developed a plug flow reactor (PFR) model of the Oakland water distribution network using Python and SciPy's solve_ivp solver to predict chlorine residual concentrations between the Pittsburgh treatment facility and residential taps. Modeled the effects of consumer demand fluctuations and water main leakage on chlorine decay and treatment performance.",
      link: "",
      skills: ["Python", "SciPy", "PFR modeling", "Water systems"],
    },
    {
      name: "Low-Cost Heat Exchanger",
      description:
        "Collaborated with a small engineering team to design and construct a low-cost counter-flow heat exchanger using hardware store materials. Conducted thermal and flow analysis using COMSOL Multiphysics to compare counter-flow and parallel-flow configurations and optimize heat transfer efficiency.",
      link: "",
      skills: ["COMSOL Multiphysics", "Thermal analysis", "Heat transfer"],
    },
    {
      name: "Chemical Engineering Filtration System",
      description:
        "Collaborated with a team of four to design a filtration system for removing dye contaminants from water. Focused on cost-effective material selection and system optimization while analyzing performance data to support design improvements.",
      link: "",
      skills: ["Filtration design", "Process optimization", "Data analysis"],
    },
  ],
  publications: [], // Not used — Publications section is hidden (removed from index.astro)
  experience: [
    {
      company: "Wood Neuro Research Group",
      title: "Undergraduate Biomedical Engineering Researcher",
      dateRange: "May 2026 – Present",
      bullets: [
        "Collected and processed multimodal participant data including EEG recordings, MEDOC sensory testing results, and psychological assessments in a clinical research environment.",
        "Analyzed experimental datasets using MATLAB and Python, applying signal processing and filtering techniques to improve data quality and support statistical interpretation.",
        "Assisted with participant onboarding and informed consent procedures while ensuring compliance with research and clinical study protocols.",
      ],
    },
    {
      company: "ExoRenal",
      title: "Biomedical Engineering Intern",
      dateRange: "May 2025 – Aug 2025",
      bullets: [
        "Assisted engineers with testing and evaluation of dialysis-related medical devices, including the XKidney system, within a laboratory environment.",
        "Supported analysis of experimental and performance data from device testing using Python data analysis tools.",
        "Participated in device setup, troubleshooting, and validation procedures for prototype medical technologies.",
      ],
    },
    {
      company: "King Orchards",
      title: "Irrigation Management Technician",
      dateRange: "Jun 2023 – Aug 2024",
      bullets: [
        "Optimized fluid distribution across a 140-acre pressurized irrigation network, applying flow and pressure principles to improve system reliability and water-use efficiency.",
        "Designed and installed infrastructure for 10 acres of newly developed orchard land, collaborating with a team of 5 to optimize zone layout and pressure distribution.",
        "Monitored flow rates and pressure across the network to identify inefficiencies, recommending and implementing repairs that improved water-use efficiency.",
      ],
    },
  ],
  education: [
    {
      school: "Carnegie Mellon University",
      degree: "B.S. in Chemical Engineering & Biomedical Engineering",
      dateRange: "Expected May 2027",
      achievements: [
        "Relevant coursework: Optimization Modeling & Algorithms, Numerical Methods & Machine Learning, Heat & Mass Transfer, Chemical Reaction Engineering, Unit Operations, Transport Process Laboratory, Molecular Foundations.",
        "Member: AIChE, Asian Student Association, CMU Poker Club, CMU ChemE Car, CMU ChemE Cube.",
      ],
    },
  ],
};