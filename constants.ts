import { CompanyProfile, Experience, Project, Service, Skill, Client, Publication, Education, WritingPost } from './types';

export const PROFILE: CompanyProfile = {
  name: "Mefby",
  owner: "Meftun Akarsu",
  title: "AI Engineer | M.Sc. AI Engineering @ THI",
  bio: "I work on AI systems \u2014 LLM infrastructure, computer vision, and data pipelines. Currently at Turkish Aerospace deploying models on NVIDIA H200 GPUs in air-gapped environments. Before that, three years at Bosch building inspection systems, anomaly detection, and process automation for manufacturing. Studying AI Engineering at TH Ingolstadt, Germany.",
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
    id: 1,
    name: "Turkish Aerospace (TAI)",
    industry: "Aerospace & Defense",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Tai_logo.png",
    link: "https://www.tusas.com"
  },
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
    id: 1,
    role: "Expert AI Engineer",
    company: "Turkish Aerospace Industries (TAI)",
    period: "Feb 2026 - Present",
    description: "Deploying LLM infrastructure on NVIDIA H200 GPUs, serving Qwen 3.5 (27B) locally. Built air-gapped RAG systems, multi-agent pipelines with CrewAI for Jira automation, and user-facing AI interfaces via Open WebUI.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Tai_logo.png"
  },
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
    id: 1,
    title: "Air-Gapped LLM Infrastructure",
    description: "LLM infrastructure on NVIDIA H200 GPUs at Turkish Aerospace. Serves Qwen 3.5 (27B) locally with multi-agent CrewAI pipelines and Open WebUI for organization-wide access.",
    tags: ["LLM", "NVIDIA H200", "CrewAI", "Open WebUI", "RAG"],
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600"
  },
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
    title: "The Silent Variable in Graph RAG: Why Corpus Language Matters More Than You Think",
    date: "2026-04-21",
    summary: "Chunk size, embeddings, re-rankers — the usual suspects. But the language of your corpus quietly shapes every layer of the pipeline, and reasoning models make it decisive.",
    tags: ["Graph RAG", "LLMs", "Multilingual", "Reasoning"],
    content: `When we talk about RAG systems, the conversation usually orbits around chunk size, embedding models, retrieval strategy, and re-rankers. But there's one variable that quietly shapes every layer of the pipeline and rarely gets the attention it deserves: **the language of your corpus.** The effect is visible even in classical vector RAG. Move to Graph RAG, and it becomes decisive. Bring reasoning models into the mix, and it moves to the center of your design decisions.

## Graph construction: everything starts here

At the core of Graph RAG lies entity extraction, relation extraction, and triplet generation. The quality of these steps is directly tied to the language of the source text.

In English, pulling entities out of "students from our school" is a relatively clean job. In an agglutinative language like Turkish, the same idea becomes "okulumuzun öğrencilerinden" — a single token train carrying possessive markers, an ablative case ending, and a noun-compound structure, all of which affect entity boundaries. Finnish, Hungarian, Korean, and Japanese raise similar flags. When the extractor — whether a classical NER model or an LLM-based one — has to guess where one entity ends and the next begins, entity resolution starts to crack. Different morphological variants of the same concept get written to the graph as separate nodes. Relations between them become noisy.

And this matters, because **everything downstream in Graph RAG depends on the topology of this graph.** A messy graph produces messy communities, messy summaries, and messy multi-hop paths. You don't notice it in metrics at first; you notice it when answers feel subtly off.

## The retrieval layer: multilingual, but not equal

Multilingual embedding models have come a long way. E5, BGE-M3, Cohere's multilingual offerings, and the open-source cohort have narrowed the gap impressively over the last two years. But "narrowed" isn't "closed." On most benchmarks, English-to-English retrieval still outperforms same-language retrieval in lower-resource languages, often by a meaningful margin on recall@k.

Graph RAG's community-detection steps — Leiden clustering, hierarchical summarization, and so on — look language-agnostic on paper. In practice, they inherit whatever noise the extraction and embedding stages produce. Garbage-in, garbage-clustered.

## Reasoning models and the language-mixing problem

Here's where things get interesting, and where most teams get caught off guard.

Reasoning models — the ones generating explicit chains of thought before producing an answer — were trained on CoT traces that are overwhelmingly English (and to a lesser extent Chinese, depending on the lab). Multiple lines of research now suggest these models effectively "think in English" internally, even when prompted in another language. They translate the input, reason in their training-dominant language, then translate the answer back.

But the problem is messier than a clean round-trip translation. Anyone who has actually stared at reasoning traces has seen it: **the models mix languages mid-thought.** Ask in Turkish, watch the chain of thought drift into English after the second step. Ask in English, catch a cluster of Chinese tokens showing up in the middle of a math derivation. Ask in Italian, get reasoning that code-switches between Italian and English paragraph by paragraph. Sometimes the final answer comes back in the wrong language entirely.

This isn't a rumor — DeepSeek explicitly documented the issue in the R1 paper. Their first-generation R1-Zero produced reasoning traces that constantly mixed languages, and they had to introduce a dedicated "language consistency reward" during reinforcement learning just to keep the model's CoT in a single language. Users of o1, Qwen's reasoning variants, and others have reported similar behavior across languages.

For a Graph RAG system this has concrete consequences:

- **Context nuance gets lost in implicit translation.** A legal clause in Turkish, a medical note in Japanese, a technical spec in German — each carries connotations that don't survive the round trip.
- **Retrieved context and reasoning drift apart.** You retrieve a Turkish passage, the model reasons over it in English, and entity names, quoted phrases, or domain terms get paraphrased along the way. The "evidence" the model thinks it's using isn't quite the evidence you retrieved.
- **Terminology drifts.** Domain-specific terms get back-translated into near-synonyms that subtly shift meaning — "tazminat" becoming "compensation" when the legally correct English term is "indemnity."
- **Multi-hop reasoning compounds the error.** Each hop is a chance for translation drift to worsen. Three hops in, you're reasoning over a paraphrase of a paraphrase.
- **Output language becomes non-deterministic.** A non-trivial portion of production bug reports in multilingual RAG setups boil down to: the model randomly answered in the wrong language.

The kicker: the final answer, rendered back in the user's language, often looks fluent. Fluency masks drift. You don't catch the problem unless you audit the reasoning trace against the original-language source — which almost nobody does at scale.

## Practical patterns that actually work

A few approaches have emerged among teams building production Graph RAG in non-English settings:

**Translate-then-build.** Translate the corpus into English, construct the graph there, and translate only the final answer back. Extraction and reasoning quality jumps noticeably. The trade-off is real though: cultural, legal, and linguistic context can flatten in translation, and named entities sometimes mangle.

**Hybrid pipelines.** Keep retrieval in the native language (users search how they think), but bridge to English for summarization and reasoning-heavy steps. This preserves recall on local terms while letting the reasoning model operate closer to its strong suit.

**Native-first with heavy curation.** Accept the quality ceiling, but invest in a high-quality domain ontology, hand-curated entity aliases, and a domain-tuned extractor. Slower to build, but keeps the system honest in the source language — often the right call for regulated domains.

**Dual-graph setups.** Build two graphs — one native, one English — and route queries based on type. Factual lookup goes native; multi-hop reasoning goes English. More infrastructure, but the quality delta is worth it for some teams.

## The takeaway

Corpus language isn't a preprocessing detail. In Graph RAG, it shapes the graph itself; in reasoning-heavy pipelines, it shapes the quality of every inference made on top of that graph. Before tuning your chunk size for the fifth time, it's worth asking a simpler question: in what language is my system actually thinking — and is that the same language my users are speaking?

The answer often isn't what teams assume. And the gap between assumption and reality is where silent quality problems live.`
  },
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
