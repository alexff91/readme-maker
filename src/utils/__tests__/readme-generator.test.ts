import { describe, it, expect } from 'vitest';
import { generateReadme, formatBadges, generateToc, formatFeatures, AVAILABLE_BADGES, type ReadmeFormData } from '../readme-generator';

const makeData = (o: Partial<ReadmeFormData> = {}): ReadmeFormData => ({
  projectName: 'Test Project', description: 'A test project', features: ['Feature 1', 'Feature 2'],
  installation: 'npm install test-project', usage: 'npx test-project', license: 'MIT',
  badges: ['react', 'typescript'], ...o,
});

describe('formatBadges', () => {
  it('returns empty for empty array', () => { expect(formatBadges([])).toBe(''); });
  it('formats a single badge', () => { const r = formatBadges(['react']); expect(r).toContain('![React]'); expect(r).toContain('img.shields.io'); });
  it('formats multiple badges', () => { const r = formatBadges(['react','typescript']); expect(r).toContain('![React]'); expect(r).toContain('![TypeScript]'); });
  it('ignores unknown ids', () => { const r = formatBadges(['unknown','react']); expect(r).toContain('![React]'); expect(r).not.toContain('unknown'); });
});

describe('generateToc', () => {
  it('returns empty for empty sections', () => { expect(generateToc([])).toBe(''); });
  it('generates correct anchors', () => { const r = generateToc(['Features','Installation']); expect(r).toContain('[Features](#features)'); expect(r).toContain('[Installation](#installation)'); });
  it('includes header', () => { expect(generateToc(['Features'])).toContain('## Table of Contents'); });
});

describe('formatFeatures', () => {
  it('returns empty for empty list', () => { expect(formatFeatures([])).toBe(''); });
  it('formats as bullet list', () => { expect(formatFeatures(['One','Two'])).toBe('- One\n- Two'); });
  it('trims whitespace', () => { expect(formatFeatures(['  spaced  '])).toBe('- spaced'); });
});

describe('generateReadme', () => {
  it('includes project name as h1', () => { expect(generateReadme(makeData())).toContain('# Test Project'); });
  it('includes description', () => { expect(generateReadme(makeData())).toContain('A test project'); });
  it('includes features section', () => { const r = generateReadme(makeData()); expect(r).toContain('## Features'); expect(r).toContain('- Feature 1'); });
  it('includes installation', () => { const r = generateReadme(makeData()); expect(r).toContain('```bash'); expect(r).toContain('npm install test-project'); });
  it('includes usage', () => { const r = generateReadme(makeData()); expect(r).toContain('## Usage'); });
  it('includes license', () => { expect(generateReadme(makeData())).toContain('MIT License'); });
  it('generates TOC', () => { expect(generateReadme(makeData())).toContain('[Features](#features)'); });
  it('skips empty sections', () => { const r = generateReadme(makeData({features:[],installation:'',usage:''})); expect(r).not.toContain('## Features'); expect(r).not.toContain('## Installation'); });
  it('uses default name when empty', () => { expect(generateReadme(makeData({projectName:''}))).toContain('# Project Name'); });
  it('includes badges', () => { expect(generateReadme(makeData())).toContain('![React]'); });
});

describe('AVAILABLE_BADGES', () => {
  it('has at least 5', () => { expect(AVAILABLE_BADGES.length).toBeGreaterThanOrEqual(5); });
  it('each has required fields', () => { AVAILABLE_BADGES.forEach(b => { expect(b.id).toBeTruthy(); expect(b.label).toBeTruthy(); expect(b.url).toContain('img.shields.io'); }); });
});
