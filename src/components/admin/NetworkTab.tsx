import { useState } from 'react'
import { Search, ZoomIn, ZoomOut, Maximize, GitBranch, Users, DollarSign } from 'lucide-react'

interface NetworkNode {
  id: number
  name: string
  rank: string
  sales: string
  children: NetworkNode[]
}

const networkData: NetworkNode = {
  id: 1, name: 'Omar Khalef', rank: 'Diamond', sales: '5.8M',
  children: [
    {
      id: 2, name: 'Ahmed Benali', rank: 'Diamond', sales: '4.2M',
      children: [
        { id: 5, name: 'Sofia M.', rank: 'Gold', sales: '1.9M', children: [
          { id: 8, name: 'Nadia B.', rank: 'Silver', sales: '1.2M', children: [] },
        ]},
        { id: 6, name: 'Farid T.', rank: 'Silver', sales: '850K', children: [] },
      ]
    },
    {
      id: 3, name: 'Karim Hadj', rank: 'Platinum', sales: '3.1M',
      children: [
        { id: 7, name: 'Amel C.', rank: 'Silver', sales: '0', children: [] },
      ]
    },
    {
      id: 4, name: 'Lina Bouzid', rank: 'Platinum', sales: '3.8M',
      children: [
        { id: 9, name: 'Rachid M.', rank: 'Gold', sales: '2.1M', children: [] },
        { id: 10, name: 'Yasmine D.', rank: 'Gold', sales: '2.4M', children: [] },
      ]
    },
  ]
}

const rankColors: Record<string, string> = {
  Starter: '#01D7D5', Silver: '#C0C0C0', Gold: '#FFD700', Platinum: '#E5E4E2', Diamond: '#B9F2FF',
}

function countNodes(node: NetworkNode): number {
  return 1 + node.children.reduce((sum, child) => sum + countNodes(child), 0)
}

export default function NetworkTab() {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<Set<number>>(new Set([1, 2, 3, 4]))
  const totalMembers = countNodes(networkData) - 1

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const renderTree = (node: NetworkNode, depth = 0) => {
    const isExpanded = expanded.has(node.id)
    const color = rankColors[node.rank] || '#484F58'
    const hasChildren = node.children.length > 0

    return (
      <div key={node.id} className="select-none">
        <div className="flex items-center gap-2 py-1.5" style={{ paddingLeft: `${depth * 28}px` }}>
          {hasChildren && (
            <button onClick={() => toggleExpand(node.id)} className="w-4 h-4 flex items-center justify-center text-[#484F58] hover:text-white text-xs">
              {isExpanded ? '−' : '+'}
            </button>
          )}
          {!hasChildren && <span className="w-4" />}
          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold"
            style={{ borderColor: color, color, backgroundColor: `${color}15` }}>
            {node.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">{node.name}</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px]" style={{ color }}>{node.rank}</span>
              <span className="text-[#484F58] text-[10px]">DZD {node.sales}</span>
            </div>
          </div>
        </div>
        {isExpanded && node.children.map((child) => renderTree(child, depth + 1))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Members', value: `${totalMembers}`, icon: <Users size={18} /> },
          { label: 'Network Depth', value: '4 levels', icon: <GitBranch size={18} /> },
          { label: 'Avg Team Size', value: '12.4', icon: <Users size={18} /> },
          { label: 'Network Sales', value: 'DZD 24.8M', icon: <DollarSign size={18} /> },
        ].map((s) => (
          <div key={s.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex items-center gap-3">
            <div className="text-[#484F58]">{s.icon}</div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#484F58]">{s.label}</p>
              <p className="text-white font-semibold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tree View */}
        <div className="lg:col-span-2 bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#30363D]">
            <h3 className="text-white font-medium text-sm">Network Hierarchy</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#484F58]" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
                  className="bg-[#0A0A0A] border border-[#30363D] text-white text-xs rounded-lg pl-8 pr-3 py-1.5 w-40 focus:border-[#01D7D5] focus:outline-none" />
              </div>
              <button className="p-1.5 text-[#484F58] hover:text-white"><ZoomIn size={14} /></button>
              <button className="p-1.5 text-[#484F58] hover:text-white"><ZoomOut size={14} /></button>
              <button className="p-1.5 text-[#484F58] hover:text-white"><Maximize size={14} /></button>
            </div>
          </div>
          <div className="p-4 overflow-auto max-h-[500px]">
            {renderTree(networkData)}
          </div>
        </div>

        {/* Legend + Stats */}
        <div className="space-y-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
            <h3 className="text-white font-medium text-sm mb-3">Rank Legend</h3>
            <div className="space-y-2">
              {Object.entries(rankColors).map(([rank, color]) => (
                <div key={rank} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[#8B949E] text-xs">{rank}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
            <h3 className="text-white font-medium text-sm mb-3">Top Performers</h3>
            <div className="space-y-3">
              {[
                { name: 'Omar Khalef', sales: '5.8M', members: 67 },
                { name: 'Lina Bouzid', sales: '3.8M', members: 38 },
                { name: 'Ahmed Benali', sales: '4.2M', members: 45 },
              ].map((p) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#30363D] flex items-center justify-center text-xs text-white">{p.name.charAt(0)}</div>
                    <span className="text-white text-xs">{p.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[#01D7D5] text-xs">DZD {p.sales}</p>
                    <p className="text-[#484F58] text-[10px]">{p.members} members</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
