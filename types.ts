export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link?: string;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
  logo?: string;
}

export interface Skill {
  subject: string;
  A: number;
  fullMark: number;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Client {
  id: number;
  name: string;
  industry: string;
  logo?: string; // URL or placeholder text
}

export interface CompanyProfile {
  name: string;
  owner: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  socials: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}