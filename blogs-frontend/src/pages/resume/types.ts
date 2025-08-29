export interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    location: string;
    birth: string;
    phone: string;
    email: string;
    avatar: string;
  };
  summary: string;
  skills: {
    languages: string[];
    frameworks: string[];
    ui: string[];
    tools: string[];
    ai: string[];
  };
  experience: Array<{
    company: string;
    position: string;
    period: string;
    current: boolean;
    achievements: string[];
  }>;
  projects: Array<{
    name: string;
    period: string;
    tech: string;
    background: string;
    achievements: string[];
  }>;
}

export type TemplateType = 'modern' | 'classic' | 'minimal';