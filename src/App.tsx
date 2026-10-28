import { useState, useMemo } from 'react';
import { marked } from 'marked';
import { generateReadme, AVAILABLE_BADGES, type ReadmeFormData } from './utils/readme-generator';

// The same project the page describes below — so the first screen already
// shows a finished README, and every field shows what goes in it.
const EXAMPLE: ReadmeFormData = {
  projectName: 'lumen',
  description: 'A tiny static-site server with live reload.',
  features: ['Zero config', 'Live reload over WebSocket', 'Single 40 kB binary'],
  installation: 'npm install -g lumen',
  usage: 'lumen ./public --port 8080',
  license: 'MIT',
  badges: ['node', 'typescript'],
};
const EMPTY: ReadmeFormData = { projectName: '', description: '', features: [''], installation: '', usage: '', license: 'MIT', badges: [] };

function App() {
  const [formData, setFormData] = useState<ReadmeFormData>(EXAMPLE);
  const [view, setView] = useState<'preview' | 'source'>('preview');
  const [copied, setCopied] = useState(false);
  const markdown = useMemo(() => generateReadme(formData), [formData]);
  const htmlPreview = useMemo(() => marked(markdown) as string, [markdown]);
  const isExample = JSON.stringify(formData) === JSON.stringify(EXAMPLE);

  const updateField = (field: keyof ReadmeFormData, value: string | string[]) => setFormData(prev => ({ ...prev, [field]: value }));
  const toggleBadge = (id: string) => setFormData(prev => ({ ...prev, badges: prev.badges.includes(id) ? prev.badges.filter(b => b !== id) : [...prev.badges, id] }));
  const addFeature = () => setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  const updateFeature = (i: number, v: string) => setFormData(prev => ({ ...prev, features: prev.features.map((f, j) => j === i ? v : f) }));
  const removeFeature = (i: number) => setFormData(prev => ({ ...prev, features: prev.features.filter((_, j) => j !== i) }));
  const copyMd = async () => { try { await navigator.clipboard.writeText(markdown); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* no clipboard */ } };
  const download = () => {
    (window as unknown as { markToolUsed?: () => void }).markToolUsed?.();
    const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown' }));
    const a = document.createElement('a'); a.href = url; a.download = 'README.md'; a.click(); URL.revokeObjectURL(url);
  };

  const field = (label: string, node: React.ReactNode) => (<div><label className="wb-label">{label}</label>{node}</div>);

  return (
    <div className="wb">
      <header className="wb-top">
        <a className="wb-brand" href="https://alftech.space/"><i />ALFTECH</a>
        <nav><a href="https://md.alftech.space/">markdown</a><a href="https://json.alftech.space/">json</a></nav>
      </header>
      <main className="wb-main">
        <div className="wb-eyebrow">README maker · runs in your browser</div>
        <h1 className="wb-h1">A front page for your repo, <em>without</em> writing one.</h1>
        <p className="wb-lede">Fill in what the project is and how to run it; the README.md writes itself — badges, contents, install and usage blocks, licence. Empty sections are left out.</p>

        <div className="wb-grid2" style={{ alignItems: 'start' }}>
          <div className="wb-stack">
            {isExample && <div className="wb-note">This is an example project. <button className="wb-btn ghost" style={{ minHeight: 34, marginLeft: 8 }} onClick={() => setFormData(EMPTY)}>Start blank</button></div>}
            {field('Project name', <input className="wb-field" style={{ fontSize: 20, fontWeight: 500 }} value={formData.projectName} onChange={e => updateField('projectName', e.target.value)} placeholder="my-project" />)}
            {field('One line about it', <textarea className="wb-field" style={{ fontFamily: 'var(--sans)' }} rows={2} value={formData.description} onChange={e => updateField('description', e.target.value)} placeholder="What it does, for whom" />)}
            {field('Badges', <div className="wb-row">{AVAILABLE_BADGES.map(b => <button key={b.id} className="wb-chip" style={{ color: 'var(--ink)' }} aria-pressed={formData.badges.includes(b.id)} onClick={() => toggleBadge(b.id)}>{b.label}</button>)}</div>)}
            {field('Features', <div className="wb-stack" style={{ display: 'grid', gap: 8 }}>
              {formData.features.map((f, i) => (
                <div key={i} className="wb-row" style={{ flexWrap: 'nowrap' }}>
                  <input className="wb-field" style={{ fontFamily: 'var(--sans)' }} value={f} onChange={e => updateFeature(i, e.target.value)} placeholder={`Feature ${i + 1}`} />
                  {formData.features.length > 1 && <button className="wb-chip" style={{ color: 'var(--bad)' }} aria-label={`Remove feature ${i + 1}`} onClick={() => removeFeature(i)}>×</button>}
                </div>))}
              <div><button className="wb-btn ghost" style={{ minHeight: 38 }} onClick={addFeature}>+ feature</button></div>
            </div>)}
            {field('Installation', <textarea className="wb-field" rows={2} value={formData.installation} onChange={e => updateField('installation', e.target.value)} placeholder="npm install my-project" />)}
            {field('Usage', <textarea className="wb-field" rows={2} value={formData.usage} onChange={e => updateField('usage', e.target.value)} placeholder="my-project --help" />)}
            {field('Licence', <select className="wb-field" value={formData.license} onChange={e => updateField('license', e.target.value)}>
              <option value="MIT">MIT</option><option value="Apache-2.0">Apache 2.0</option><option value="GPL-3.0">GPL 3.0</option><option value="BSD-3-Clause">BSD 3-Clause</option><option value="">None</option>
            </select>)}
          </div>

          <div style={{ position: 'sticky', top: 16 }}>
            <div className="wb-row" style={{ marginBottom: 10 }}>
              <button className="wb-chip" style={{ color: 'var(--ink)', opacity: view === 'preview' ? 1 : .6 }} aria-pressed={view === 'preview'} onClick={() => setView('preview')}>As GitHub shows it</button>
              <button className="wb-chip" style={{ color: 'var(--ink)', opacity: view === 'source' ? 1 : .6 }} aria-pressed={view === 'source'} onClick={() => setView('source')}>README.md</button>
            </div>
            {view === 'preview'
              ? <div className="md-preview" dangerouslySetInnerHTML={{ __html: htmlPreview }} />
              : <pre className="wb-slab wb-mono" style={{ margin: 0, fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: '70vh', overflow: 'auto' }}>{markdown}</pre>}
            <div className="wb-row" style={{ marginTop: 12 }}>
              <button className="wb-btn acc" onClick={copyMd}>{copied ? 'Copied ✓' : 'Copy Markdown'}</button>
              <button className="wb-btn ghost" onClick={download}>Download README.md</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
