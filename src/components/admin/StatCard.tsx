import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string
  change: string
  positive?: boolean
  icon: ReactNode
  warning?: boolean
}

export default function StatCard({ label, value, change, positive = true, icon, warning }: StatCardProps) {
  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 hover:border-[#484F58] transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] uppercase tracking-[0.08em] text-[#484F58] font-medium">{label}</span>
        <span className="text-[#484F58]">{icon}</span>
      </div>
      <p className="text-white font-semibold text-xl mb-1">{value}</p>
      <span className={`text-xs flex items-center gap-1 ${warning ? 'text-[#EF4444]' : positive ? 'text-[#01D7D5]' : 'text-[#EF4444]'}`}>
        {positive && !warning ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {change}
      </span>
    </div>
  )
}
