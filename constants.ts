import type { CompanyProfile, Experience, Project, Product, Service, Skill, Client, Publication, Education, WritingPost } from './types';

export const PROFILE: CompanyProfile = {
  name: "Mefby",
  owner: "Meftun Akarsu",
  title: "AI Engineer | M.Sc. AI Engineering @ THI",
  role: "AI Engineer",
  headline: "LLM systems, computer vision & data",
  bio: "I work on AI systems \u2014 LLM infrastructure, computer vision, and data pipelines. Three years at Bosch building inspection systems, anomaly detection, and process automation for manufacturing. Studying AI Engineering at TH Ingolstadt, Germany.",
  about: [
    "I build AI systems that run in production: retrieval and agent pipelines on large language models, computer vision for manufacturing, and the data work in between.",
    "Three years at Bosch on vision inspection and process automation, then production RAG and GraphRAG systems at RADIAITE and Hagia. I study AI Engineering for Autonomous Systems at TH Ingolstadt and write framework-free courses on RAG, agents and evals."
  ],
  closing: "Building Oyla and Flashjot, and open to the right conversations.",
  email: "meftunakrsu@gmail.com",
  location: "Ankara, Turkiye",
  socials: {
    linkedin: "https://www.linkedin.com/in/meftunakarsu/",
    github: "https://github.com/mftnakrsu",
    medium: "https://medium.com/@meftunakarsu"
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
    spec: ["Live polls", "Word clouds", "Self-hosted"],
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
  },
  {
    slug: "flashjot",
    name: "Flashjot",
    tagline: "A small notebook for Linux, Windows and macOS: press a shortcut, write the idea down, press Enter, and you're back to work.",
    metaTitle: "Flashjot: quick notes from anywhere, saved as Markdown",
    summary: "A small notebook for Linux, Windows and macOS. One shortcut opens a quick box from anywhere, and every note is a plain Markdown file. MIT licensed.",
    description: "Ideas show up at bad times: in the middle of a build, a meeting or a sentence. Flashjot keeps a capture box one shortcut away. Quick notes land in an Inbox, and later you file them into folders in the notebook. Every note is a plain Markdown file on your disk (Documents/Flashjot by default), so Obsidian, VS Code, grep and git can read it too.",
    status: "Open source",
    launched: "2026-10",
    license: "MIT",
    languages: ["EN", "TR"],
    platforms: ["Linux", "Windows", "macOS"],
    spec: ["Desktop app", "Markdown", "Tauri"],
    stack: ["Tauri", "Rust", "Svelte", "TypeScript", "CodeMirror"],
    features: [
      "Quick box (Ctrl+Alt+N, ⌘⌥N on macOS): opens on the monitor your mouse is on. Enter saves, Shift+Enter adds a line, and Esc closes it while keeping your draft.",
      "Notebook (Ctrl+Alt+D): folders, pages, a Markdown editor with live styling and clickable checkboxes, and full-text search (Ctrl+K).",
      "Tasks: start a quick note with [] to add tasks; Open tasks lists every unchecked task across your notes.",
      "Inbox: quick notes wait as cards. Move one into a folder with M and it takes its title from its first line; delete with Del, and undo if you change your mind.",
      "Plain files: each note is a .md file, so your notes stay readable even without Flashjot.",
      "Safe writes: every save goes to a temporary file first and is then swapped in, so a crash or power cut never leaves a half-written note.",
      "Keyboard first, with configurable global shortcuts. Light and dark themes follow the system, and the interface is in English and Turkish.",
      "Small: built with Tauri, so it uses the system web view instead of bundling a browser.",
      "Installers for Linux (.deb, .rpm, AppImage), Windows (.exe, .msi) and macOS (.dmg). The macOS build is not notarized yet, and on Wayland you add the two global shortcuts in your desktop's keyboard settings."
    ],
    steps: [
      {
        title: "Catch it",
        body: "Press Ctrl+Alt+N wherever you are. A small box opens on top of whatever you are doing; type the idea and press Enter."
      },
      {
        title: "Let it wait",
        body: "The note lands in the Inbox as a card and waits there until you have time to sort it."
      },
      {
        title: "File it",
        body: "Ctrl+Alt+D opens the notebook. Press M to move a card into a folder, or keep writing on a Markdown page."
      }
    ],
    links: {
      download: "https://github.com/mftnakrsu/flashjot/releases/latest",
      docs: "https://flashjot.mefby.com",
      source: "https://github.com/mftnakrsu/flashjot"
    },
    image: {
      src: "/products/flashjot/notebook.png",
      alt: "The Flashjot notebook: folders and pages on the left, and a Markdown page called Robot arm with a checklist of parts on the right",
      width: 1000,
      height: 680
    },
    video: {
      src: "/products/flashjot/demo.mp4",
      poster: "/products/flashjot/poster.png",
      caption: "A 40-second tour: catching an idea in the middle of a build, finding it in the Inbox, filing it with one key, and the notebook."
    },
    gallery: [
      {
        images: [
          {
            src: "/products/flashjot/notebook.png",
            alt: "The Flashjot notebook: folders and pages on the left, and a Markdown page called Robot arm with a checklist of parts on the right",
            width: 1000,
            height: 680
          }
        ],
        caption: "The notebook. Folders and pages on the left; Markdown with live styling and checkboxes you tick with a click."
      },
      {
        images: [
          {
            src: "/products/flashjot/inbox.png",
            alt: "The Inbox in the light theme: three quick notes as cards, newest first",
            width: 1000,
            height: 680
          },
          {
            src: "/products/flashjot/inbox-dark.png",
            alt: "The same Inbox in the dark theme",
            width: 1000,
            height: 680
          }
        ],
        caption: "The Inbox, light and dark. Quick notes wait here as cards until you sort them."
      }
    ]
  },
  {
    slug: "ulgen",
    name: "Ülgen",
    tagline: "Connects EVREN, Türkiye's national model API, to the coding tools you already use: Qwen Code, opencode, Codex CLI and Claude Code.",
    metaTitle: "Ülgen: EVREN for the coding tools you already use",
    summary: "One binary that signs you in to EVREN, Türkiye's national model API, and sets up Qwen Code, opencode, Codex CLI or Claude Code to use it. AGPL-3.0.",
    description: "The coding tools already work well, and EVREN serves capable open-weight models. What is missing is the part in between: signing in, keeping the key safe, accepting the terms, watching the quota, writing the right settings into each tool, and a Turkish interface. Ülgen is that part. It is one binary, not a new coding agent, and it is named after the creator deity of Turkic mythology.",
    status: "Open source",
    launched: "2026-10",
    license: "AGPL-3.0-only",
    languages: ["EN", "TR"],
    platforms: ["Linux", "Windows", "macOS"],
    applicationCategory: "DeveloperApplication",
    spec: ["Command line", "Go", "Coding agents"],
    stack: ["Go"],
    features: [
      "Run ulgen and it signs you in, finds the coding tools you have installed, asks which one you want, sets it up for EVREN and starts it. Later runs start that tool straight away.",
      "Works with Qwen Code, opencode, Codex CLI and Claude Code. Setup backs up every file it changes, --dry-run shows the change first, and setup --remove takes it out again.",
      "ulgen status shows the remaining daily quota and the models; ulgen doctor checks the key, EVREN and every tool, and says what to do about what is wrong.",
      "The key is kept in the operating system's credential store. It is never written into a tool's settings file, never printed and never logged.",
      "Claude Code never receives the key at all: it talks to a translator inside Ülgen on your own machine.",
      "Every command follows the system language, Turkish or English.",
      "Installs with one line on Linux and macOS, or in PowerShell on Windows; Pardus, Debian and Ubuntu packages are available too.",
      "Known limits: Anthropic does not support Claude Code with other models, so ulgen run claude goes through the translator and says so, and token counts on EVREN are estimates.",
      "Independent and non-commercial: not affiliated with EVREN or the makers of the tools it sets up."
    ],
    steps: [
      {
        title: "Sign in",
        body: "Run ulgen. It opens EVREN's API keys page (sign-in is through e-Devlet), shows the terms and saves your key in the credential store."
      },
      {
        title: "Pick a tool",
        body: "Ülgen finds the coding tools you have installed, asks which one you want and writes the EVREN settings into it, keeping a backup."
      },
      {
        title: "Start coding",
        body: "The tool starts on an EVREN model. Next time ulgen starts it straight away; ulgen opencode, qwen, codex or claude switches to another one."
      }
    ],
    links: {
      docs: "https://ulgen.mefby.com",
      source: "https://github.com/mftnakrsu/ulgen"
    },
    image: {
      src: "/products/ulgen/poster.png",
      alt: "Claude Code running on an EVREN model in a terminal: asked what main.go prints, it reads the file and answers 6765, the 20th Fibonacci number",
      width: 1920,
      height: 1080
    },
    video: {
      src: "/products/ulgen/demo.mp4",
      poster: "/products/ulgen/poster.png",
      caption: "A 40-second tour: signing in, setup showing its change before writing it, doctor and status, and Claude Code answering on an EVREN model."
    }
  },
  {
    slug: "agent-buzzer",
    name: "agent-buzzer",
    tagline: "Plays a sound when Claude Code finishes a long turn, and stays quiet when you are already looking at the terminal.",
    metaTitle: "agent-buzzer: hear when your AI agent finishes",
    summary: "A small shell tool that plays a sound when Claude Code finishes a long turn, and stays quiet when the turn was short or you are watching the terminal. MIT licensed.",
    description: "A tool that beeps after every turn becomes unbearable within an hour, so agent-buzzer only plays when it is worth interrupting you: the turn took longer than 30 seconds and your terminal is not the window in front of you. When something can't be determined, it plays, because a missed notification is worse than one extra beep. Claude Code is the only agent wired up today; Codex, Cursor's agent and Antigravity are on the roadmap.",
    status: "Open source",
    launched: "2026-07",
    license: "MIT",
    platforms: ["macOS", "Linux", "Windows"],
    applicationCategory: "DeveloperApplication",
    spec: ["Claude Code hooks", "Shell script", "No dependencies"],
    stack: ["Bash", "PowerShell"],
    features: [
      "Four events, each with its own sound: done, waiting (a permission prompt or a question), error and subagent.",
      "Silence rules, checked in order: the master switch, quiet hours (off by default), turns shorter than 30 seconds, and your own terminal being the frontmost app.",
      "Focus detection compares the frontmost app with the terminal Claude Code runs in. On macOS it needs no Accessibility or Automation permission.",
      "buzzer status says whether it would play right now and why; buzzer doctor checks audio, focus detection and missing files; every decision is logged with its reason.",
      "One shell script with no dependencies. buzzer hooks prints the settings snippet for you to add; it never edits ~/.claude/settings.json itself.",
      "Hooks come back in about 0.3 seconds: playback runs detached, and the focus check is capped at two seconds.",
      "Plain key=value configuration. Sounds, volume, the threshold and quiet hours can all be changed from the command line.",
      "macOS is the reference platform. Linux and Windows (buzzer.ps1) work but are less tested, and on Wayland focus detection only works on sway."
    ],
    steps: [
      {
        title: "Install",
        body: "Run ./install.sh. It copies buzzer to ~/.local/bin, adds the bundled sounds and writes a default config."
      },
      {
        title: "Wire up the hooks",
        body: "buzzer hooks prints the snippet for Claude Code's settings. You add it yourself with the /hooks command."
      },
      {
        title: "Look away",
        body: "Start a long task and switch to something else. When the turn ends you hear it; if you were watching the terminal, it stays quiet."
      }
    ],
    links: {
      source: "https://github.com/mftnakrsu/agent-buzzer"
    },
    image: {
      src: "/products/agent-buzzer/banner.png",
      alt: "The agent-buzzer banner: a bell connected to the icons of Claude, Codex, Cursor and Antigravity, above the line “Hear when your AI agent finishes.”",
      width: 1200,
      height: 800
    },
    gallery: [
      {
        images: [
          {
            src: "/products/agent-buzzer/demo.gif",
            alt: "A terminal running buzzer status twice: with the terminal in front, every event is silent; after looking away, every event would play",
            width: 1100,
            height: 400
          }
        ],
        caption: "The same command a moment apart: looking at the terminal, then looking away. A GIF has no sound, so it shows the decision."
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
