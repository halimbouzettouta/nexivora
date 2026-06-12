import { useState } from 'react'
import { Trophy, Gift, Edit2, Zap, Award, Crown, Diamond } from 'lucide-react'

const rankIcons = [<Zap size={20} />, <Award size={20} />, <Trophy size={20} />, <Crown size={20} />, <Diamond size={20} />]

const ranks = [
  { id: 1, name: 'Starter', color: '#01D7D5', minSales: '0', minTeam: '0', minDirect: 0, reward: 'Welcome Kit', members: 45, icon: 0 },
  { id: 2, name: 'Silver', color: '#C0C0C0', minSales: '500,000', minTeam: '0', minDirect: 10, reward: 'Shopping Voucher (DZD 10,000)', members: 38, icon: 1 },
  { id: 3, name: 'Gold', color: '#FFD700', minSales: '500,000', minTeam: '2,000,000', minDirect: 25, reward: 'Premium Smartphone', members: 24, icon: 2 },
  { id: 4, name: 'Platinum', color: '#E5E4E2', minSales: '500,000', minTeam: '5,000,000', minDirect: 50, reward: 'Electric Scooter', members: 12, icon: 3 },
  { id: 5, name: 'Diamond', color: '#B9F2FF', minSales: '500,000', minTeam: '10,000,000', minDirect: 100, reward: 'Luxury Trip or DZD 500K Cash', members: 4, icon: 4 },
]

const rewardsHistory = [
  { marketer: 'Ahmed Benali', rank: 'Gold', reward: 'Premium Smartphone', date: '2025-04-15', status: 'delivered' },
  { marketer: 'Omar Khalef', rank: 'Diamond', reward: 'Luxury Trip', date: '2025-03-20', status: 'shipped' },
  { marketer: 'Karim Hadj', rank: 'Platinum', reward: 'Electric Scooter', date: '2025-05-01', status: 'delivered' },
  { marketer: 'Yasmine D.', rank: 'Gold', reward: 'Premium Smartphone', date: '2025-05-28', status: 'pending' },
]

export default function RanksTab() {
  const [editing, setEditing] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ reward: '', minSales: '', minTeam: '' })

  return (
    <div className="space-y-6">
      {/* Rank Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {ranks.map((rank) => (
          <div key={rank.id} className="bg-[#161B22] border rounded-xl p-5 transition-all hover:-translate-y-1" style={{ borderColor: rank.color + '40' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: rank.color + '20', color: rank.color }}>
              {rankIcons[rank.icon]}
            </div>
            <h4 className="text-center font-semibold text-base mb-1" style={{ color: rank.color }}>{rank.name}</h4>
            <div className="text-center space-y-1 mb-3">
              <p className="text-[#484F58] text-[10px]">Personal: DZD {rank.minSales}</p>
              <p className="text-[#484F58] text-[10px]">Team: DZD {rank.minTeam}</p>
              <p className="text-[#484F58] text-[10px]">Direct: {rank.minDirect} sales</p>
            </div>
            <div className="bg-black/30 rounded-lg p-2 mb-3">
              <div className="flex items-center gap-1.5 justify-center">
                <Gift size={12} style={{ color: rank.color }} />
                <span className="text-[#8B949E] text-[11px]">{rank.reward}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#484F58] text-[10px]">{rank.members} members</span>
              <button onClick={() => { setEditing(rank.id); setEditForm({ reward: rank.reward, minSales: rank.minSales, minTeam: rank.minTeam }) }}
                className="p-1 text-[#484F58] hover:text-[#01D7D5] transition-colors">
                <Edit2 size={12} />
              </button>
            </div>
            {editing === rank.id && (
              <div className="mt-3 space-y-2 border-t border-[#30363D] pt-3">
                <input value={editForm.reward} onChange={(e) => setEditForm({ ...editForm, reward: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#30363D] text-white text-xs rounded px-2 py-1.5" />
                <div className="flex gap-2">
                  <button onClick={() => setEditing(null)} className="flex-1 py-1.5 bg-[#01D7D5] text-black text-xs rounded">Save</button>
                  <button onClick={() => setEditing(null)} className="flex-1 py-1.5 border border-[#30363D] text-[#8B949E] text-xs rounded">Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Visual Rank Ladder */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
        <h3 className="text-white font-medium mb-6">Rank Progression Path</h3>
        <div className="flex items-center justify-center gap-0">
          {ranks.map((rank, idx) => (
            <div key={rank.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all"
                  style={{ borderColor: rank.color, backgroundColor: rank.color + '15' }}>
                  <span style={{ color: rank.color }}>{rankIcons[rank.icon]}</span>
                </div>
                <p className="text-white text-xs font-medium mt-2">{rank.name}</p>
                <p className="text-[#484F58] text-[10px]">DZD {rank.minTeam}</p>
              </div>
              {idx < ranks.length - 1 && (
                <div className="w-12 h-0.5 mx-1" style={{ background: `linear-gradient(to right, ${rank.color}, ${ranks[idx + 1].color})` }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rewards History */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
        <h3 className="text-white font-medium mb-4">Rewards Distribution History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                {['Marketer', 'Rank Achieved', 'Reward', 'Date', 'Status'].map((h) => <th key={h} className="text-left py-3 px-3 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rewardsHistory.map((r, idx) => (
                <tr key={idx} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="py-3 px-3 text-white">{r.marketer}</td>
                  <td className="py-3 px-3"><span className="text-xs" style={{ color: ranks.find((rank) => rank.name === r.rank)?.color }}>{r.rank}</span></td>
                  <td className="py-3 px-3 text-[#8B949E]">{r.reward}</td>
                  <td className="py-3 px-3 text-[#484F58] text-xs">{r.date}</td>
                  <td className="py-3 px-3">
                    <span className={`text-[11px] px-2 py-1 rounded-full ${r.status === 'delivered' ? 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]' : r.status === 'shipped' ? 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6]' : 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]'}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
