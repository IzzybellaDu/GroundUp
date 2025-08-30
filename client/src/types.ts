export interface Project {
  id: string;
  title: string;
  description: string;
  type: 'Environmental/sustainability' | 'Traffic' | 'Bike lanes' | 'Roads' | 'Public transport';
  votes: number;
  userVote: 'up' | 'down' | null;
  concerns: {
    cost: string;
    devTime: string;
    environmentalImpact: string;
    safety: string;
    infrastructure: string;
    community: string;
  };
  likes: string[];
  urgency: 'Low' | 'Medium' | 'High';
  createdAt: string;
}

export const PROJECT_TYPES = [
  'Environmental/sustainability',
  'Traffic', 
  'Bike lanes',
  'Roads',
  'Public transport'
] as const;

export const URGENCY_LEVELS = ['Low', 'Medium', 'High'] as const;