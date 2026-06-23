import { useState } from 'react'
import { Edit2, Trash2, Eye, Plus } from 'lucide-react'
import StatusBadge from './StatusBadge'

const articles = [
  { id: 1, title: 'How to Extend Your Battery Life', slug: 'extend-battery-life', category: 'Battery Care', status: 'published', views: 1245, date: '2025-05-15' },
  { id: 2, title: 'Best Charging Practices for E-Scooters', slug: 'charging-practices', category: 'Maintenance', status: 'published', views: 982, date: '2025-05-20' },
  { id: 3, title: 'Safety Tips for Riding in Global Cities', slug: 'safety-tips-cities', category: 'Safety', status: 'published', views: 2103, date: '2025-05-25' },
  { id: 4, title: 'Understanding Your E-Bike Motor', slug: 'understanding-ebike-motor', category: 'Technology', status: 'published', views: 756, date: '2025-06-01' },
  { id: 5, title: 'New Nexivora Trail Blazer Review', slug: 'trail-blazer-review', category: 'News', status: 'draft', views: 0, date: '2025-06-08' },
]

const pages = [
  { id: 1, title: 'Home', slug: '/', lastEdited: '2025-06-01', status: 'published' },
  { id: 2, title: 'About Us', slug: '/about', lastEdited: '2025-05-20', status: 'published' },
  { id: 3, title: 'Contact', slug: '/contact', lastEdited: '2025-06-05', status: 'published' },
  { id: 4, title: 'Privacy Policy', slug: '/privacy', lastEdited: '2025-04-10', status: 'published' },
]

const banners = [
  { id: 1, name: 'Summer Sale Banner', position: 'Homepage Hero', status: 'active', clicks: 452, impressions: 12400 },
  { id: 2, name: 'Referral Program CTA', position: 'Homepage Bottom', status: 'active', clicks: 312, impressions: 8900 },
  { id: 3, name: 'New Product Launch', position: 'Store Header', status: 'inactive', clicks: 0, impressions: 0 },
]

export default function ContentTab() {
  const [activeView, setActiveView] = useState<'articles' | 'pages' | 'banners'>('articles')
  const [showEditor, setShowEditor] = useState(false)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Published Articles', value: '4' },
          { label: 'Drafts', value: '1' },
          { label: 'Total Views', value: '5,086' },
          { label: 'Active Banners', value: '2' },
        ].map((s) => (
          <div key={s.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4">
            <p className="text-[11px] uppercase tracking-wider text-[#484F58]">{s.label}</p>
            <p className="text-white font-semibold text-xl mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 border-b border-[#30363D]">
          {(['articles', 'pages', 'banners'] as const).map((v) => (
            <button key={v} onClick={() => setActiveView(v)}
              className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeView === v ? 'text-[#01D7D5] border-[#01D7D5]' : 'text-[#484F58] border-transparent hover:text-white'}`}>
              {v}
            </button>
          ))}
        </div>
        <button onClick={() => setShowEditor(true)} className="flex items-center gap-2 px-4 py-2 bg-[#01D7D5] text-black font-medium text-xs rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all">
          <Plus size={14} /> {activeView === 'articles' ? 'New Article' : activeView === 'pages' ? 'New Page' : 'New Banner'}
        </button>
      </div>

      {activeView === 'articles' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                  {['Title', 'Category', 'Status', 'Views', 'Date', 'Actions'].map((h) => <th key={h} className="text-left py-3 px-3 font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr key={a.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="py-3 px-3 text-white">{a.title}</td>
                    <td className="py-3 px-3 text-[#8B949E] text-xs">{a.category}</td>
                    <td className="py-3 px-3"><StatusBadge status={a.status} /></td>
                    <td className="py-3 px-3 text-[#8B949E] text-xs">{a.views.toLocaleString()}</td>
                    <td className="py-3 px-3 text-[#484F58] text-xs">{a.date}</td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1.5">
                        <button className="p-1.5 text-[#484F58] hover:text-[#01D7D5]"><Eye size={14} /></button>
                        <button onClick={() => setShowEditor(true)} className="p-1.5 text-[#484F58] hover:text-white"><Edit2 size={14} /></button>
                        <button className="p-1.5 text-[#484F58] hover:text-[#EF4444]"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'pages' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                  {['Page', 'Slug', 'Status', 'Last Edited', 'Actions'].map((h) => <th key={h} className="text-left py-3 px-3 font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {pages.map((p) => (
                  <tr key={p.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="py-3 px-3 text-white">{p.title}</td>
                    <td className="py-3 px-3 text-[#484F58] font-mono text-xs">{p.slug}</td>
                    <td className="py-3 px-3"><StatusBadge status={p.status} /></td>
                    <td className="py-3 px-3 text-[#484F58] text-xs">{p.lastEdited}</td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => setShowEditor(true)} className="p-1.5 text-[#484F58] hover:text-white"><Edit2 size={14} /></button>
                        <button className="p-1.5 text-[#484F58] hover:text-[#EF4444]"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'banners' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                  {['Banner', 'Position', 'Status', 'Clicks', 'Impressions', 'CTR', 'Actions'].map((h) => <th key={h} className="text-left py-3 px-3 font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {banners.map((b) => (
                  <tr key={b.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="py-3 px-3 text-white">{b.name}</td>
                    <td className="py-3 px-3 text-[#8B949E] text-xs">{b.position}</td>
                    <td className="py-3 px-3"><StatusBadge status={b.status} /></td>
                    <td className="py-3 px-3 text-white">{b.clicks}</td>
                    <td className="py-3 px-3 text-[#8B949E]">{b.impressions.toLocaleString()}</td>
                    <td className="py-3 px-3 text-[#01D7D5]">{b.impressions > 0 ? ((b.clicks / b.impressions) * 100).toFixed(1) : 0}%</td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1.5">
                        <button className="p-1.5 text-[#484F58] hover:text-white"><Edit2 size={14} /></button>
                        <button className="p-1.5 text-[#484F58] hover:text-[#EF4444]"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showEditor && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#30363D]">
              <h3 className="text-white font-semibold">Content Editor</h3>
              <button onClick={() => setShowEditor(false)} className="text-[#484F58] hover:text-white">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[#8B949E] text-xs mb-1 block">Title</label>
                <input className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" placeholder="Enter title..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#8B949E] text-xs mb-1 block">Category</label>
                  <select className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none">
                    {['Battery Care', 'Maintenance', 'Safety', 'Technology', 'News'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[#8B949E] text-xs mb-1 block">Status</label>
                  <select className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[#8B949E] text-xs mb-1 block">Content</label>
                <textarea rows={12} className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none resize-none font-mono text-sm" placeholder="Write your content here in Markdown..." />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowEditor(false)} className="flex-1 py-3 bg-[#01D7D5] text-black font-medium rounded-lg">Save</button>
                <button onClick={() => setShowEditor(false)} className="px-6 py-3 border border-[#30363D] text-[#8B949E] rounded-lg">Save as Draft</button>
                <button onClick={() => setShowEditor(false)} className="px-6 py-3 border border-[#30363D] text-[#8B949E] rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
