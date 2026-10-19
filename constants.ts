import { CompanyProfile, Experience, Project, Product, Service, Skill, Client, Publication, Education, WritingPost } from './types';

export const PROFILE: CompanyProfile = {
  name: "Mefby",
  owner: "Meftun Akarsu",
  title: "AI Engineer | M.Sc. AI Engineering @ THI",
  bio: "I work on AI systems \u2014 LLM infrastructure, computer vision, and data pipelines. Three years at Bosch building inspection systems, anomaly detection, and process automation for manufacturing. Studying AI Engineering at TH Ingolstadt, Germany.",
  email: "meftunakrsu@gmail.com",
  location: "Ankara, Turkiye",
  socials: {
    linkedin: "https://www.linkedin.com/in/meftunakarsu/",
    github: "https://github.com/mftnakrsu",
    twitter: "https://medium.com/@meftunakarsu"
  }
};

export const SERVICES: Service[] = [
  {
    id: 1,
    title: "LLM & RAG Systems",
    description: "RAG pipelines, multi-agent workflows with CrewAI and LangChain, LLM deployment on NVIDIA GPUs.",
    icon: "\u{1F9E0}"
  },
  {
    id: 2,
    title: "Computer Vision",
    description: "Quality inspection, object detection, and video generation with YOLO, PyTorch, OpenCV.",
    icon: "\u{1F441}\uFE0F"
  },
  {
    id: 3,
    title: "Data & Analytics",
    description: "Manufacturing optimization, anomaly detection, big data on Azure and Databricks.",
    icon: "\u{1F4CA}"
  },
  {
    id: 4,
    title: "MLOps & Cloud",
    description: "Docker, CI/CD, Azure Container Apps, MLflow, GitHub Actions.",
    icon: "\u{1F916}"
  }
];

export const EMPLOYERS: Client[] = [
  {
    id: 2,
    name: "RADIAITE",
    industry: "AI for Nonprofits",
    logo: "https://ui-avatars.com/api/?name=R&background=1a1a1a&color=f59e0b&size=128&bold=true&font-size=0.5",
    link: "https://www.radiaite.com"
  },
  {
    id: 3,
    name: "BOSCH",
    industry: "Automotive & Manufacturing",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch-logo.svg",
    link: "https://www.bosch.com.tr"
  },
  {
    id: 4,
    name: "Coskunoz Holding",
    industry: "Manufacturing",
    logo: "https://ui-avatars.com/api/?name=CO&background=1a1a1a&color=f59e0b&size=128&bold=true&font-size=0.4",
    link: "https://www.coskunoz.com.tr"
  },
  {
    id: 5,
    name: "Move ON",
    industry: "AgriTech",
    logo: "https://ui-avatars.com/api/?name=MO&background=1a1a1a&color=f59e0b&size=128&bold=true&font-size=0.4",
    link: "https://moveon.ai"
  }
];

export const FREELANCE_CLIENTS: Client[] = [
  {
    id: 6,
    name: "Hagia",
    industry: "Software & AI",
    logo: "https://ui-avatars.com/api/?name=H&background=1a1a1a&color=f59e0b&size=128&bold=true&font-size=0.5",
    link: "https://www.hagia.co"
  },
  {
    id: 7,
    name: "KCTEK",
    industry: "Autonomous Systems",
    logo: "https://eurocc.truba.gov.tr/wp-content/uploads/2022/10/kctek-logo-new-300x135-2.png",
    link: "https://kctek.com.tr"
  },
  {
    id: 8,
    name: "Snowbite",
    industry: "AI Solutions",
    logo: "https://ui-avatars.com/api/?name=SB&background=1a1a1a&color=f59e0b&size=128&bold=true&font-size=0.4"
  },
  {
    id: 9,
    name: "SimurgAI",
    industry: "AI Research",
    logo: "https://ui-avatars.com/api/?name=SA&background=1a1a1a&color=f59e0b&size=128&bold=true&font-size=0.4"
  }
];

export const CLIENTS: Client[] = [...EMPLOYERS, ...FREELANCE_CLIENTS];

export const EXPERIENCE: Experience[] = [
  {
    id: 2,
    role: "AI Developer",
    company: "RADIAITE",
    period: "Aug 2025 - Feb 2026",
    description: "Built Odigos, a production RAG chatbot for autism spectrum families in Italy (Fondazione Paideia). End-to-end pipeline: knowledge graph traversal + vector search + semantic reranking with Cohere and GPT-4.1. Deployed on Azure Container Apps with Neo4j, pgvector, CI/CD via GitHub Actions.",
    logo: "https://ui-avatars.com/api/?name=R&background=1a1a1a&color=f59e0b&size=128&bold=true&font-size=0.5"
  },
  {
    id: 3,
    role: "AI Engineer",
    company: "Hagia",
    period: "Aug 2025 - Feb 2026",
    description: "Fine-tuned Stable Diffusion (WAN 2.1) for Img2Vid pipelines. Built Graph-RAG and LightRAG systems with Neo4j. Managed Azure deployments and built n8n-based agent workflows for unstructured data extraction.",
    logo: "https://ui-avatars.com/api/?name=H&background=1a1a1a&color=f59e0b&size=128&bold=true&font-size=0.5"
  },
  {
    id: 4,
    role: "AI Engineer",
    company: "Robert Bosch GmbH",
    period: "Oct 2022 - Sep 2025",
    description: "Built YOLO + PyTorch inspection pipelines that cut destructive testing from 9/day to 3/day. Automated welding parameter optimization with XGBoost. 5000 hrs/yr productivity gain via RPA.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch-logo.svg"
  },
  {
    id: 5,
    role: "AI Engineer Management Trainee",
    company: "Coskunoz Holding",
    period: "Apr 2022 - Oct 2022",
    description: "Implemented RTLS (UWB, Bluetooth) for asset tracking. Built operator tracking with Raspberry Pi 4, YOLO, TensorFlow, and MediaPipe. Predictive maintenance models with XGBoost and LightGBM.",
    logo: "https://ui-avatars.com/api/?name=CO&background=1a1a1a&color=f59e0b&size=128&bold=true&font-size=0.4"
  },
  {
    id: 6,
    role: "Embedded Systems & AI Engineer Intern",
    company: "Move ON",
    period: "Jan 2022 - Apr 2022",
    description: "Built an OCR-based product recognition system integrating AI/ML with PLC (Snap7) for production line automation.",
    logo: "https://ui-avatars.com/api/?name=MO&background=1a1a1a&color=f59e0b&size=128&bold=true&font-size=0.4"
  }
];

export const PROJECTS: Project[] = [
  {
    id: 2,
    title: "Odigos \u2014 RAG Chatbot",
    description: "Production RAG chatbot for autism spectrum families in Italy. 58+ features, knowledge graph + vector search + semantic reranking on Azure with Neo4j and pgvector.",
    tags: ["RAG", "Neo4j", "pgvector", "Azure", "GPT-4"],
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 3,
    title: "Visual Quality Control",
    description: "YOLO + PyTorch inspection pipeline at Bosch. Cut destructive testing from 9/day to 3/day. OCR and Cognex vision inspections reduced customer complaints by 10%.",
    tags: ["YOLO", "PyTorch", "OpenCV", "Cognex"],
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 4,
    title: "Cinematic Video Generation",
    description: "Fine-tuned Wan2.1 I2V-14B with LoRA for cinematic scene synthesis from limited data. Single-GPU pipeline producing coherent 720p video sequences.",
    tags: ["Stable Diffusion", "LoRA", "Video AI", "arXiv"],
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=600",
    link: "https://arxiv.org/abs/2510.27364"
  },
  {
    id: 5,
    title: "Aerial Object Detection",
    description: "Compared YOLO v3-v8 on VisDrone-2019 aerial images. Optimized with TensorRT for Jetson Nano and Jetson Orin. Published at IEEE INISTA 2023.",
    tags: ["YOLO", "TensorRT", "Jetson", "UAV", "IEEE"],
    imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=600",
    link: "https://doi.org/10.1109/INISTA59065.2023.10310562"
  }
];

// Products I build and run. Each entry gets a card on /products and a page at
// /products/<slug>; screenshots and media live under public/products/<slug>/.
export const PRODUCTS: Product[] = [
  {
    slug: "flashjot",
    name: "Flashjot",
    tagline: "A quick-capture box and notebook for your desktop: press a shortcut, write the idea down, press Enter.",
    metaTitle: "Flashjot: open-source quick capture and Markdown notebook",
    summary: "Press Ctrl+Alt+N anywhere, type, press Enter. Flashjot saves the idea and gets out of the way. Plain Markdown notes. Linux, Windows, macOS. MIT licensed.",
    description: "Ideas show up at bad times. Flashjot keeps a small capture box one shortcut away on Linux, Windows and macOS, and a notebook for when you have time to sort things out. Every note is a plain Markdown file in your Documents folder, so you can read it without the app.",
    status: "Open source",
    launched: "2026-10",
    license: "MIT",
    languages: ["EN", "TR"],
    operatingSystem: "Linux, Windows, macOS",
    applicationCategory: "ProductivityApplication",
    stack: ["Rust", "Tauri", "Svelte", "TypeScript", "CodeMirror"],
    features: [
      "Ctrl+Alt+N opens the quick box on the monitor your mouse is on, with the cursor already in it. Enter saves.",
      "Esc or a click elsewhere closes the box and keeps the draft for next time.",
      "Quick notes land in an Inbox. Press M to file one into a folder; it gets a title from its first line.",
      "A notebook with folders, a Markdown editor with live styling, clickable checkboxes and full-text search.",
      "Notes are plain .md files. Open them in Obsidian or VS Code, keep them in git or a synced folder.",
      "Every save is atomic, so a crash or power cut never leaves a half-written note.",
      "English and Turkish interface, light and dark mode.",
      "A 3 MB installer for Linux (.deb, .rpm, AppImage), Windows and macOS. No account, no network access.",
      "Open source under the MIT license."
    ],
    steps: [
      {
        title: "Capture",
        body: "Press Ctrl+Alt+N in any app, type the thought and press Enter. The box closes and you are back where you were."
      },
      {
        title: "Sort",
        body: "Open the notebook with Ctrl+Alt+D. Quick notes wait in the Inbox; move one into a folder with M or delete it."
      },
      {
        title: "Write",
        body: "Pages are Markdown with headings, checkboxes and code blocks, saved as you type and searchable with Ctrl+K."
      }
    ],
    links: {
      docs: "https://flashjot.mefby.com",
      source: "https://github.com/mftnakrsu/flashjot"
    },
    image: {
      src: "/products/flashjot/notebook.png",
      alt: "The Flashjot notebook with the folders Ideas and Work in the sidebar and a page called Robot arm with headings, checkboxes and a code block",
      width: 2160,
      height: 1350
    },
    video: {
      src: "/products/flashjot/flashjot-demo.mp4",
      poster: "/products/flashjot/poster.png",
      caption: "A short walkthrough: capturing an idea with the quick box, finding it in the Inbox, filing it into a folder and writing a checklist."
    },
    gallery: [
      {
        images: [
          {
            src: "/products/flashjot/quick-box.png",
            alt: "The quick box over a dark desktop: a white card with a red rule under the Flashjot title and the text \u201CTry a belt drive for the shoulder joint\u201D",
            width: 1600,
            height: 900
          }
        ],
        caption: "The quick box. Enter saves, Shift+Enter adds a line, Esc closes it and keeps the draft."
      },
      {
        images: [
          {
            src: "/products/flashjot/inbox.png",
            alt: "The Inbox with three quick notes shown as cards with red top rules and the time each was written",
            width: 2160,
            height: 1350
          }
        ],
        caption: "The Inbox. Quick notes wait here as cards until you file them."
      },
      {
        images: [
          {
            src: "/products/flashjot/move.png",
            alt: "The Move to dialog over the Inbox with \u201CIde\u201D typed, offering the folder Ideas, a new folder and No folder",
            width: 2160,
            height: 1350
          }
        ],
        caption: "Filing a note. Type a few letters of a folder and press Enter."
      },
      {
        images: [
          {
            src: "/products/flashjot/dark.png",
            alt: "The notebook in dark mode with the Robot arm page open",
            width: 2160,
            height: 1350
          }
        ],
        caption: "Dark mode follows your system setting."
      }
    ]
  },
  {
    slug: "oyla",
    name: "Oyla",
    tagline: "Open-source live polls, word clouds and open questions for talks, classes and meetings.",
    metaTitle: "Oyla: open-source live polls and word clouds",
    summary: "Open-source live polls, word clouds and open questions. The audience joins from their phones with a 6-digit code, no accounts or app. MIT licensed.",
    description: "Your audience joins from their phones with a 6-digit code or a QR code, with no accounts and no app to install, and their answers appear live on your screen. You run it on your own computer or server. \u201COyla\u201D means \u201Cvote!\u201D in Turkish.",
    status: "Open source",
    launched: "2026-10",
    license: "MIT",
    languages: ["EN", "TR"],
    stack: ["Node.js", "Fastify", "Socket.IO", "SQLite", "React", "Docker"],
    features: [
      "The audience joins from their phones with a 6-digit code or a QR code. No accounts, no app.",
      "Four question types: multiple choice, word cloud, open question and scale.",
      "Results update live on the presenter screen as answers come in.",
      "Four colour themes per presentation; phones follow the presenter's choice.",
      "English and Turkish interface, light and dark mode.",
      "Self-hosted: one Docker container with Node.js, Fastify, Socket.IO, SQLite and React.",
      "Open source under the MIT license."
    ],
    steps: [
      {
        title: "Create",
        body: "Start a presentation and add your questions: multiple choice, word cloud, open question or scale."
      },
      {
        title: "Share the code",
        body: "Put the presenter screen up. People open your Oyla server on their phones and type the 6-digit code, or scan the QR code."
      },
      {
        title: "Watch answers arrive",
        body: "Votes, words and answers show up on the big screen live while people respond."
      }
    ],
    links: {
      docs: "https://oyla.mefby.com",
      source: "https://github.com/mftnakrsu/oyla"
    },
    image: {
      src: "/products/oyla/present-results.png",
      alt: "Oyla presenter screen showing multiple-choice results as horizontal bars, with the join code and QR code at the top",
      width: 2160,
      height: 1350
    },
    video: {
      src: "/products/oyla/oyla-demo.mp4",
      poster: "/products/oyla/poster.png",
      caption: "A short walkthrough: asking a question, joining from a phone, watching results arrive live and picking a theme."
    },
    gallery: [
      {
        images: [
          {
            src: "/products/oyla/editor.png",
            alt: "The Oyla editor with four questions and the theme picker on the left and a multiple-choice question with four options being edited on the right",
            width: 2160,
            height: 1350
          }
        ],
        caption: "The editor. Add questions, reorder them, pick a theme and copy the join link."
      },
      {
        images: [
          {
            src: "/products/oyla/phone-vote.png",
            alt: "A phone screen showing the question \u201CWhich feature should we build next?\u201D with four answer options and a Send vote button",
            width: 1170,
            height: 1992
          },
          {
            src: "/products/oyla/phone-thanks.png",
            alt: "A phone screen with a green \u201Cvoted\u201D stamp and the message \u201CAnswer sent\u201D",
            width: 1170,
            height: 1992
          }
        ],
        caption: "On a phone. Pick an answer, send it, then watch the big screen."
      },
      {
        images: [
          {
            src: "/products/oyla/present-results.png",
            alt: "The presenter screen showing live multiple-choice results as horizontal bars with percentages and vote counts",
            width: 2160,
            height: 1350
          }
        ],
        caption: "The presenter screen. Bars fill up as votes come in; the join code stays at the top."
      },
      {
        images: [
          {
            src: "/products/oyla/word-cloud.png",
            alt: "A word cloud on the presenter screen: \u201Cmomentum\u201D largest in the middle, other words smaller, some of them written vertically",
            width: 2160,
            height: 1350
          }
        ],
        caption: "A word cloud. The more people give a word, the bigger it gets."
      }
    ]
  }
];

export const PUBLICATIONS: Publication[] = [
  {
    id: 1,
    title: "Fine-Tuning Open Video Generators for Cinematic Scene Synthesis: A Small-Data Pipeline with LoRA and Wan2.1 I2V",
    authors: "M. Akarsu, K. Catay, S. B. Vedat, E. K. Yarkan, I. Senturk, A. Sar, D. Eksioglu",
    venue: "arXiv:2510.27364",
    year: 2025,
    link: "https://arxiv.org/abs/2510.27364"
  },
  {
    id: 2,
    title: "RAG-Driven Data Quality Governance for Enterprise ERP Systems",
    authors: "M. Akarsu",
    venue: "arXiv:2511.16700",
    year: 2025,
    link: "https://arxiv.org/abs/2511.16700"
  },
  {
    id: 3,
    title: "Code2Doc: A Quality-First Curated Dataset for Code Documentation",
    authors: "R. K. Karaman, M. Akarsu",
    venue: "arXiv:2512.18748",
    year: 2025,
    link: "https://arxiv.org/abs/2512.18748"
  },
  {
    id: 4,
    title: "Multiple Small-Scale Object Detection in Aerial Vehicle Images using Standard or Optimized YOLO Detectors",
    authors: "Z. E. Kaymakci, M. Akarsu, C. N. Ozturk",
    venue: "IEEE INISTA 2023",
    year: 2023,
    link: "https://doi.org/10.1109/INISTA59065.2023.10310562"
  }
];

export const EDUCATION: Education[] = [
  {
    id: 1,
    degree: "M.Sc. AI Engineering for Autonomous Systems",
    school: "Technische Hochschule Ingolstadt (THI)",
    location: "Ingolstadt, Germany",
    period: "Mar 2025 - Present",
    description: "AI systems, autonomous systems engineering, intelligent robotics."
  },
  {
    id: 2,
    degree: "B.Sc. Electrical and Electronics Engineering",
    school: "Uludag University",
    location: "Bursa, Turkiye",
    period: "2018 - 2023",
    gpa: "3.48 / 4.0"
  },
  {
    id: 3,
    degree: "Erasmus+ Exchange Program",
    school: "University of Zilina",
    location: "Zilina, Slovakia",
    period: "2021 - 2022",
    gpa: "3.88 / 4.0"
  }
];

export const CERTIFICATIONS: string[] = [
  "MLOps Specialization \u2014 Duke University (2024)",
  "Deep Learning Specialization \u2014 DeepLearning.AI (2022)",
  "TensorFlow Developer \u2014 DeepLearning.AI (2022)",
  "Fundamentals of Deep Learning \u2014 NVIDIA (2020)",
  "SQL for Data Science \u2014 UC Davis (2024)",
  "Generative AI for Everyone \u2014 DeepLearning.AI (2023)",
  "Intro to Generative AI \u2014 Google Cloud (2023)",
  "RPA Developer \u2014 LinkedIn Learning (2023)",
  "Python 101 \u2014 IBM Cognitive Class (2020)"
];

export const WRITING: WritingPost[] = [
  {
    title: "Why is Monitoring Machine Learning Algorithms Difficult?",
    date: "2025-01-25",
    url: "https://medium.com/@meftunakarsu/why-is-monitoring-machine-learning-algorithms-difficult-849e63921c3d"
  },
  {
    title: "REST API'den Web Uygulamalar\u0131na: FastAPI, Flask ve Streamlit Rehberi",
    date: "2025-01-25",
    url: "https://medium.com/@meftunakarsu/rest-apiden-web-uygulamalar%C4%B1na-fastapi-flask-ve-streamlit-rehberi-444e9f1ea307"
  },
  {
    title: "From Azure to Databricks: Data Analysis & Visualization Guide",
    date: "2024-03-22",
    url: "https://medium.com/@meftunakarsu/from-azure-to-databricks-data-analysis-visualization-guide-2e9de3143057"
  },
  {
    title: "ETL and Data Pipelines with Shell, Airflow and Kafka",
    date: "2024-01-27",
    url: "https://medium.com/@meftunakarsu/etl-and-data-pipelines-with-shell-airflow-and-kafka-699e2d78c8c1"
  },
  {
    title: "Database Design using ERD PostgreSQL",
    date: "2024-01-24",
    url: "https://medium.com/@meftunakarsu/database-design-using-erd-postgresql-16a634c02a66"
  },
  {
    title: "Nedir bu Deep Fake?",
    date: "2023-10-11",
    url: "https://medium.com/@meftunakarsu/nedir-bu-deep-fake-2c95aa35e7bd"
  },
  {
    title: "Maximizing Efficiency with UiPath: Streamline Data Entry in 5 Steps",
    date: "2023-03-31",
    url: "https://medium.com/@meftunakarsu/maximizing-efficiency-with-uipath-how-to-streamline-data-entry-processes-in-5-step-68036f4a6a82"
  },
  {
    title: "Real Time Location System (RTLS)",
    date: "2022-10-03",
    url: "https://medium.com/@meftunakarsu/real-time-location-system-rtls-eb927cea78cd"
  }
];

export const SKILLS: Skill[] = [
  { subject: 'GenAI & LLMs', A: 95, fullMark: 100 },
  { subject: 'Computer Vision', A: 90, fullMark: 100 },
  { subject: 'Data Engineering', A: 85, fullMark: 100 },
  { subject: 'Python / C++', A: 90, fullMark: 100 },
  { subject: 'MLOps & Cloud', A: 85, fullMark: 100 },
];
