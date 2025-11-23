import { CompanyProfile, Experience, Project, Service, Skill, Client } from './types';

export const PROFILE: CompanyProfile = {
  name: "Mefby",
  owner: "Meftun Akarsu", 
  title: "AI Engineer & Data Scientist | M.Sc. Autonomous Systems",
  bio: "I am an Electronics Engineer specializing in Artificial Intelligence, Computer Vision, and Autonomous Systems, currently pursuing my M.Sc. at TH Ingolstadt, Germany. With proven experience at industry leaders like Bosch and TUSAŞ, I transform complex data into intelligent, autonomous solutions that drive efficiency and innovation.",
  email: "meftunakrsu@gmail.com",
  location: "Ingolstadt, Germany / Bursa, Turkiye",
  socials: {
    linkedin: "https://www.linkedin.com/in/meftunakarsu/",
    github: "https://github.com/mftnakrsu",
    twitter: "https://medium.com/@meftunakarsu" // Using Medium as twitter placeholder
  }
};

export const SERVICES: Service[] = [
  {
    id: 1,
    title: "AI Agents & LLM Solutions",
    description: "Developing RAG systems, intelligent agents, and custom automation workflows using OpenAI, LangChain, and AutoGen.",
    icon: "🧠"
  },
  {
    id: 2,
    title: "Computer Vision Systems",
    description: "End-to-end vision pipelines for quality control, object detection, and tracking using YOLO, PyTorch, and OpenCV.",
    icon: "👁️"
  },
  {
    id: 3,
    title: "Data Science & Analytics",
    description: "Optimizing manufacturing throughput (TPT), anomaly detection, and big data processing on Azure & Databricks.",
    icon: "📊"
  },
  {
    id: 4,
    title: "Autonomous Systems",
    description: "Simulation and mapping for autonomous vehicles using ROS, SLAM, Lidar data, and Digital Twin technologies.",
    icon: "🤖"
  }
];

// 1. Full-time / Internship Employers
export const EMPLOYERS: Client[] = [
  { 
    id: 1, 
    name: "BOSCH", 
    industry: "Automotive",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch-logo.svg" 
  },
  { 
    id: 2, 
    name: "TUSAŞ", 
    industry: "Defense",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Tai_logo.png" 
  },
  {
    id: 8,
    name: "ASELSAN",
    industry: "Defense",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c4/ASELSAN_logo.svg"
  },
  {
    id: 9,
    name: "Coşkunöz",
    industry: "Manufacturing",
    logo: "https://scontent.fist2-4.fna.fbcdn.net/v/t39.30808-6/398312848_659688936304255_6636351612656847453_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=jsl2ZZxbogQQ7kNvwFoWiGv&_nc_oc=AdlGaur5WjWCOXqQFfohFROw92ptR9guLVEMkPE47yup0Pj6pyCCsIGmmrWX7kFNMyc&_nc_zt=23&_nc_ht=scontent.fist2-4.fna&_nc_gid=VkJ8nDBepVrAqMxwl3TxuQ&oh=00_AfgWiHGB8PGAGqvhbJXuezN2w3Ym-TW_XBl-7erObXwoZg&oe=6928F991"
  }
];

// 2. Freelance / Project Partners
export const FREELANCE_CLIENTS: Client[] = [
  { 
    id: 3, 
    name: "Move On", 
    industry: "AgriTech",
    logo: "https://www.platform.moveon.ai/static/assets/images/moveon_logo_b_with_r_stretch.png"
  },
  { 
    id: 4, 
    name: "KCTEK", 
    industry: "Technology",
    logo: "https://eurocc.truba.gov.tr/wp-content/uploads/2022/10/kctek-logo-new-300x135-2.png"
  },
  { 
    id: 5, 
    name: "Hagia", 
    industry: "Software",
    logo: "https://media.licdn.com/dms/image/v2/C560BAQEUvpNv_2AtYA/company-logo_200_200/company-logo_200_200/0/1630655630166/hagia_logo?e=1765411200&v=beta&t=U3a1tkId2zVHTQ_DkEgVFsohEH6g9fq7p0MIqA0zA7g"
  },
  { 
    id: 6, 
    name: "Radiatie", 
    industry: "Technology",
    logo: "https://media.licdn.com/dms/image/v2/D4D0BAQHT5hq4bUH5KQ/company-logo_200_200/company-logo_200_200/0/1732433602169/radiaite_logo?e=1765411200&v=beta&t=P0izNNRHge17ESv4pdzm6Fp1Wuz94MCpivnrVRoMvWQ"
  },
  { 
    id: 7, 
    name: "Snowbite", 
    industry: "AI Solutions",
    logo: "https://ui-avatars.com/api/?name=Snowbite&background=0f172a&color=06b6d4&size=128&bold=true&length=1"
  }
];

// Combined list for AI context
export const CLIENTS: Client[] = [...EMPLOYERS, ...FREELANCE_CLIENTS];

export const EXPERIENCE: Experience[] = [
  {
    id: 1,
    role: "Data Scientist (AI, ML, Vision)",
    company: "BOSCH",
    period: "Oct 2022 - Present",
    description: "Optimized manufacturing throughput by 30% via MES data analysis. Developed YOLO & PyTorch-based vision systems reducing destructive testing frequency (saving ~€30K/year). Built RAG-based AI assistants for technical documentation.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch-logo.svg"
  },
  {
    id: 5,
    role: "AI Software Engineer",
    company: "Hagia",
    period: "Project Based",
    description: "Developed commercial computer vision applications and AI-driven software solutions for diverse industrial use cases, focusing on real-time object detection and process automation.",
    logo: "https://media.licdn.com/dms/image/v2/C560BAQEUvpNv_2AtYA/company-logo_200_200/company-logo_200_200/0/1630655630166/hagia_logo?e=1765411200&v=beta&t=U3a1tkId2zVHTQ_DkEgVFsohEH6g9fq7p0MIqA0zA7g"
  },
  {
    id: 6,
    role: "Autonomous Systems Engineer",
    company: "KCTEK",
    period: "Project Based",
    description: "Conducted R&D on autonomous navigation systems and simulation environments. Worked on sensor fusion algorithms and path planning modules for unmanned vehicles.",
    logo: "https://eurocc.truba.gov.tr/wp-content/uploads/2022/10/kctek-logo-new-300x135-2.png"
  },
  {
    id: 2,
    role: "Graduate Researcher",
    company: "TUSAŞ (Turkish Aerospace)",
    period: "Nov 2022 - Aug 2023",
    description: "Conducted advanced R&D on Digital Twins and autonomous system integration for aerospace applications. Utilized MATLAB/Simulink for control simulation and deep learning for predictive maintenance.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Tai_logo.png"
  },
  {
    id: 3,
    role: "AI Engineer Trainee",
    company: "Coşkunöz Holding",
    period: "Apr 2022 - Oct 2022",
    description: "Implemented RTLS (UWB/Bluetooth) for asset tracking. Developed computer vision-based operator tracking systems on Raspberry Pi using YOLO and TensorFlow.",
    logo: "https://scontent.fist2-4.fna.fbcdn.net/v/t39.30808-6/398312848_659688936304255_6636351612656847453_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=jsl2ZZxbogQQ7kNvwFoWiGv&_nc_oc=AdlGaur5WjWCOXqQFfohFROw92ptR9guLVEMkPE47yup0Pj6pyCCsIGmmrWX7kFNMyc&_nc_zt=23&_nc_ht=scontent.fist2-4.fna&_nc_gid=VkJ8nDBepVrAqMxwl3TxuQ&oh=00_AfgWiHGB8PGAGqvhbJXuezN2w3Ym-TW_XBl-7erObXwoZg&oe=6928F991"
  },
  {
    id: 4,
    role: "Intern Engineering Student",
    company: "ASELSAN",
    period: "Summer 2021",
    description: "Gained hands-on experience in defense electronics, signal processing, and embedded software development. Contributed to testing and validation processes for communication systems.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c4/ASELSAN_logo.svg"
  }
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Visual Quality Control System",
    description: "A destructive test reduction system for Bosch production lines. Reduced tests from 9/day to 3/day using YOLO & PyTorch, saving €30K annually.",
    tags: ["YOLO", "PyTorch", "OpenCV", "Industrial AI"],
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 2,
    title: "RAG-Based AI Assistant",
    description: "An intelligent document processing system for FMEA and work instructions. Built with LangChain and OpenAI to facilitate smart querying of technical data.",
    tags: ["GenAI", "LangChain", "RAG", "Streamlit"],
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 3,
    title: "Autonomous Vehicle Mapping",
    description: "Mapping and simulation infrastructure for autonomous driving using 3D Lidar data, SLAM, and Gmapping within ROS environments.",
    tags: ["ROS", "Lidar", "SLAM", "C++", "Gazebo"],
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 4,
    title: "Snowbite AI Booking Agent",
    description: "A multi-agent reservation system for freelance clients. Handles product search, FAQs, and payments using LLMs and automated workflows.",
    tags: ["AI Agents", "Automation", "Python", "Bot"],
    imageUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=600"
  }
];

export const SKILLS: Skill[] = [
  { subject: 'GenAI & LLM Agents', A: 95, fullMark: 100 },
  { subject: 'Computer Vision', A: 90, fullMark: 100 },
  { subject: 'Data Eng. (Azure)', A: 85, fullMark: 100 },
  { subject: 'Python / C++', A: 90, fullMark: 100 },
  { subject: 'MLOps & DevOps', A: 75, fullMark: 100 },
];