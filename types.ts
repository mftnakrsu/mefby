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
  logo?: string;
  link?: string;
}

export interface Publication {
  id: number;
  title: string;
  authors: string;
  venue: string;
  year: number;
  link?: string;
}

export interface Education {
  id: number;
  degree: string;
  school: string;
  location: string;
  period: string;
  gpa?: string;
  description?: string;
  logo?: string;
}

export interface WritingPost {
  title: string;
  date: string;
  url?: string;
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