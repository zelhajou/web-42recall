// app/components/decks/deck-filters.tsx
'use client';

import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select';
import type { DeckFilters } from '@/types/deck';

const COMMON_42_PROJECTS = [
  'Libft',
  'ft_printf',
  'get_next_line',
  'Born2beroot',
  'FdF',
  'minitalk',
  'push_swap',
  'minishell',
  'philosophers',
  'NetPractice',
  'cub3d/miniRT',
  'CPP Modules',
  'inception',
  'ft_irc',
  'ft_transcendence'
] as const;

const TOPICS = [
  'C Functions',
  'System Calls',
  'Data Structures',
  'Algorithms',
  'Shell Commands',
  'Networking',
  'Memory Management',
  'Process Management',
  'Docker',
  'Git Commands',
  'Project Tips',
  'Common Errors'
] as const;

const SORT_OPTIONS = [
  { label: 'Recently Updated', value: 'updated' },
  { label: 'Recently Created', value: 'created' },
  { label: 'Alphabetical', value: 'alpha' },
  { label: 'Most Cards', value: 'cards' },
  { label: 'Most Popular', value: 'popular' },
] as const;

interface DeckFiltersProps {
  filters: DeckFilters;
  onChange: (filters: DeckFilters) => void;
}

export function DeckFilters({ filters, onChange }: DeckFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Input 
        placeholder="Search decks or creators..."
        className="max-w-xs"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />
      
      <Select 
        value={filters.project || 'all'} 
        onValueChange={(value) => onChange({ ...filters, project: value === 'all' ? null : value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {COMMON_42_PROJECTS.map((project) => (
            <SelectItem key={project} value={project.toLowerCase()}>
              {project}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={filters.topic || 'all'} 
        onValueChange={(value) => onChange({ ...filters, topic: value === 'all' ? null : value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Topic" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Topics</SelectItem>
          {TOPICS.map((topic) => (
            <SelectItem key={topic} value={topic.toLowerCase()}>
              {topic}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={filters.sortBy} 
        onValueChange={(value: any) => onChange({ ...filters, sortBy: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}