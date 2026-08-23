import { useState, useMemo } from 'react';
import { marked } from 'marked';
import { generateReadme, AVAILABLE_BADGES, type ReadmeFormData } from './utils/readme-generator';

function App() {
  const [formData, setFormData] = useState<ReadmeFormData>({
    projectName: '', description: '', features: [''], installation: '', usage: '', license: 'MIT', badges: [],
  });
  const [copied, setCopied] = useState(false);
  const markdown = useMemo(() => generateReadme(formData), [formData]);
  const htmlPreview = useMemo(() => marked(markdown) as string, [markdown]);

  const updateField = (field: keyof ReadmeFormData, value: string | string[]) => setFormData(prev => ({ ...prev, [field]: value }));
  const toggleBadge = (id: string) => setFormData(prev => ({ ...prev, badges: prev.badges.includes(id) ? prev.badges.filter(b => b !== id) : [...prev.badges, id] }));
  const addFeature = () => setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  const updateFeature = (i: number, v: string) => setFormData(prev => ({ ...prev, features: prev.features.map((f, j) => j === i ? v : f) }));
  const removeFeature = (i: number) => setFormData(prev => ({ ...prev, features: prev.features.filter((_, j) => j !== i) }));
  const copyMd = async () => { try { await navigator.clipboard.writeText(markdown); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {} };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 p-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">README Maker</h1>
          <button onClick={copyMd} className="bg-green-600 hover:bg-green-700 px-4 py-2 min-h-11 rounded-lg text-sm font-medium">{copied ? 'Copied!' : 'Copy Markdown'}</button>
        </div>
      </header>
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Project Name</label>
            <input type="text" value={formData.projectName} onChange={e => updateField('projectName', e.target.value)} placeholder="My Awesome Project" className="w-full min-h-11 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea value={formData.description} onChange={e => updateField('description', e.target.value)} placeholder="A brief description" rows={3} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Badges</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_BADGES.map(badge => (
                <button key={badge.id} onClick={() => toggleBadge(badge.id)} className={`inline-flex items-center min-h-11 px-4 py-1 rounded-full text-xs font-medium ${formData.badges.includes(badge.id) ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{badge.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Features</label>
            <div className="space-y-2">
              {formData.features.map((feature, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={feature} onChange={e => updateFeature(i, e.target.value)} placeholder={`Feature ${i+1}`} className="flex-1 min-h-11 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-green-500" />
                  {formData.features.length > 1 && <button onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-300 px-2 min-w-11 min-h-11">X</button>}
                </div>
              ))}
              <button onClick={addFeature} className="text-green-400 hover:text-green-300 text-sm inline-flex items-center min-h-11">+ Add Feature</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Installation</label>
            <textarea value={formData.installation} onChange={e => updateField('installation', e.target.value)} placeholder="npm install my-project" rows={3} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 font-mono text-sm resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Usage</label>
            <textarea value={formData.usage} onChange={e => updateField('usage', e.target.value)} placeholder="import { thing } from 'my-project'" rows={3} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 font-mono text-sm resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">License</label>
            <select value={formData.license} onChange={e => updateField('license', e.target.value)} className="w-full min-h-11 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500">
              <option value="MIT">MIT</option>
              <option value="Apache-2.0">Apache 2.0</option>
              <option value="GPL-3.0">GPL 3.0</option>
              <option value="BSD-3-Clause">BSD 3-Clause</option>
              <option value="">None</option>
            </select>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-300 border-b border-gray-800 pb-2">Preview</h2>
          <div className="prose prose-invert max-w-none bg-gray-900 border border-gray-800 rounded-lg p-6 overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }} dangerouslySetInnerHTML={{ __html: htmlPreview }} />
        </div>
      </div>
    </div>
  );
}

export default App;
