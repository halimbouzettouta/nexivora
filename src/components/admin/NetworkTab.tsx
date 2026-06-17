import { useState, useEffect } from 'react'
import { GitBranch, Users, DollarSign, ArrowRight } from 'lucide-react'
import { getMarketerAccounts, getFullDownline, getDirectReferrals, type MarketerAccount } from '@/hooks/marketerAuth'

interface NetworkNode {
  id: string
  name: string
  rank: string
  joinedAt: string
  children: NetworkNode[]
}

function buildTree(accounts: MarketerAccount[], parentCode: string): NetworkNode[] {
  const children = accounts.filter(a => a.parentReferralCode === parentCode)
  return children.map(child => ({
    id: child.referralCode,
    name: child.name,
    rank: child.rank,
    joinedAt: child.joinedAt,
    children: buildTree(accounts, child.referralCode),
  }))
}

function TreeNode({ node, level }: { node: NetworkNode; level: number }) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = node.children.length > 0
  const indent = Math.min(level, 5) * 24

  const rankColors: Record<string, string> = {
    Starter: '#8B949E', Silver: '#C0C0C0', Gold: '#FFD700', Platinum: '#E5E4E2', Diamond: '#B9F2FF',
  }

  return (
    <div>
      <div
        className="flex items-center gap-3 py-2 border-b border-[#30363D]/30 hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer"
        style={{ paddingLeft: `${indent}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren ? (
          <span className={`text-[#484F58] transition-transform ${expanded ? '' : '-rotate-90'}`}>
            <ArrowRight size={12} />
          </span>
        ) : (
          <span className="w-3" />
        )}
        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: rankColors[node.rank] || '#8B949E' }} />
        <span className="text-white text-sm font-medium">{node.name}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: `${rankColors[node.rank] || '#8B949E'}22`, color: rankColors[node.rank] || '#8B949E' }}>{node.rank}</span>
        <span className="text-[#484F58] text-xs ml-auto">{node.joinedAt}</span>
      </div>
      {expanded && node.children.map(child => (
        <TreeNode key={child.id} node={child} level={level + 1} />
      ))}
    </div>
  )
}

export default function NetworkTab() {
  const [accounts, setAccounts] = useState<MarketerAccount[]>([])
  const [selectedRoot, setSelectedRoot] = useState<string | null>(null)

  useEffect(() => {
    const accs = getMarketerAccounts()
    setAccounts(accs)
  }, [])

  // Find top-level marketers (no parent)
  const topLevel = accounts.filter(a => !a.parentReferralCode)

  // Compute stats for selected root
  const rootCode = selectedRoot || (topLevel[0]?.referralCode || '')
  const direct = rootCode ? getDirectReferrals(rootCode) : []
  const fullDownline = rootCode ? getFullDownline(rootCode) : []

  // Build tree from selected root
  const tree = rootCode ? buildTree(accounts, rootCode) : []

  // Total network stats
  const totalAccounts = accounts.length
  const totalWithParent = accounts.filter(a => a.parentReferralCode).length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Accounts', value: String(totalAccounts), icon: <Users size={18} /> },
          { label: 'Top-Level', value: String(topLevel.length), icon: <GitBranch size={18} /> },
          { label: 'With Referrer', value: String(totalWithParent), icon: <ArrowRight size={18} /> },
          { label: 'Max Depth', value: `${fullDownline.length > 0 ? Math.max(0, ...fullDownline.map(d => d.level)) : 0}`, icon: <DollarSign size={18} /> },
        ].map((s) => (
          <div key={s.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#484F58]">{s.icon}</span>
              <span className="text-[11px] uppercase tracking-wider text-[#484F58]">{s.label}</span>
            </div>
            <p className="text-white font-semibold text-xl">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Root selector */}
      {topLevel.length > 0 && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4">
          <label className="text-[#484F58] text-xs uppercase tracking-wider block mb-2">View Network Tree For:</label>
          <div className="flex flex-wrap gap-2">
            {topLevel.map(tl => (
              <button
                key={tl.referralCode}
                onClick={() => setSelectedRoot(tl.referralCode)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  rootCode === tl.referralCode
                    ? 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]'
                    : 'text-[#8B949E] border border-[#30363D] hover:border-[#01D7D5]'
                }`}
              >
                {tl.name} ({direct.length} direct)
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tree */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <GitBranch size={18} className="text-[#01D7D5]" />
          Network Tree
          {rootCode && accounts.find(a => a.referralCode === rootCode) && (
            <span className="text-[#484F58] text-xs ml-2">
              — Root: {accounts.find(a => a.referralCode === rootCode)?.name}
            </span>
          )}
        </h3>
        {tree.length === 0 ? (
          <p className="text-[#484F58] text-sm text-center py-8">No network data yet. Referrals will appear here when people register using referral links.</p>
        ) : (
          <div className="max-h-[500px] overflow-y-auto">
            {tree.map(node => (
              <TreeNode key={node.id} node={node} level={0} />
            ))}
          </div>
        )}
      </div>

      {/* Downline table */}
      {fullDownline.length > 0 && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">Full Downline ({fullDownline.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                  {['Name', 'Referral Code', 'Rank', 'Level', 'Joined'].map(h => <th key={h} className="text-left py-3 px-3 font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {fullDownline.map((d, i) => (
                  <tr key={i} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="py-2 px-3 text-white">{d.account.name}</td>
                    <td className="py-2 px-3 text-[#01D7D5] font-mono text-xs">{d.account.referralCode}</td>
                    <td className="py-2 px-3"><span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${rankColors[d.account.rank] || '#8B949E'}22`, color: rankColors[d.account.rank] || '#8B949E' }}>{d.account.rank}</span></td>
                    <td className="py-2 px-3 text-[#484F58]">L{d.level}</td>
                    <td className="py-2 px-3 text-[#484F58] text-xs">{d.account.joinedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
