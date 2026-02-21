export interface ReadmeFormData {
  projectName: string;
  description: string;
  features: string[];
  installation: string;
  usage: string;
  license: string;
  badges: string[];
}

export interface Badge {
  id: string;
  label: string;
  url: string;
}

export const AVAILABLE_BADGES: Badge[] = [
  { id: 'node', label: 'Node.js', url: 'https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white' },
  { id: 'react', label: 'React', url: 'https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black' },
  { id: 'typescript', label: 'TypeScript', url: 'https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white' },
  { id: 'python', label: 'Python', url: 'https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white' },
  { id: 'javascript', label: 'JavaScript', url: 'https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black' },
  { id: 'vue', label: 'Vue.js', url: 'https://img.shields.io/badge/Vue.js-4FC08D?style=flat&logo=vue.js&logoColor=white' },
  { id: 'angular', label: 'Angular', url: 'https://img.shields.io/badge/Angular-DD0031?style=flat&logo=angular&logoColor=white' },
  { id: 'docker', label: 'Docker', url: 'https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white' },
  { id: 'rust', label: 'Rust', url: 'https://img.shields.io/badge/Rust-000000?style=flat&logo=rust&logoColor=white' },
  { id: 'go', label: 'Go', url: 'https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white' },
];

export function formatBadges(badgeIds: string[]): string {
  const badges = badgeIds.map(id => AVAILABLE_BADGES.find(b => b.id === id)).filter((b): b is Badge => b !== undefined);
  if (badges.length === 0) return '';
  return badges.map(b => `![${b.label}](${b.url})`).join(' ') + '\n';
}

export function generateToc(sections: string[]): string {
  if (sections.length === 0) return '';
  const lines = sections.map(s => {
    const anchor = s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/ +/g, '-');
    return `- [${s}](#${anchor})`;
  });
  return '## Table of Contents\n\n' + lines.join('\n') + '\n';
}

export function formatFeatures(features: string[]): string {
  if (features.length === 0) return '';
  return features.map(f => `- ${f.trim()}`).join('\n');
}

export function generateReadme(data: ReadmeFormData): string {
  const parts: string[] = [];
  parts.push(`# ${data.projectName || 'Project Name'}\n`);
  const badgeStr = formatBadges(data.badges);
  if (badgeStr) parts.push(badgeStr);
  if (data.description) parts.push(`${data.description}\n`);
  const tocSections: string[] = [];
  const nonEmptyFeatures = data.features.filter(f => f.trim());
  if (nonEmptyFeatures.length > 0) tocSections.push('Features');
  if (data.installation.trim()) tocSections.push('Installation');
  if (data.usage.trim()) tocSections.push('Usage');
  if (data.license.trim()) tocSections.push('License');
  if (tocSections.length > 0) parts.push(generateToc(tocSections));
  if (nonEmptyFeatures.length > 0) parts.push(`## Features\n\n${formatFeatures(nonEmptyFeatures)}\n`);
  if (data.installation.trim()) parts.push('## Installation\n\n```bash\n' + data.installation.trim() + '\n```\n');
  if (data.usage.trim()) parts.push('## Usage\n\n```\n' + data.usage.trim() + '\n```\n');
  if (data.license.trim()) parts.push(`## License\n\nThis project is licensed under the ${data.license} License.\n`);
  return parts.join('\n');
}
