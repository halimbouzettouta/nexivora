const statusStyles: Record<string, string> = {
  completed: 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]',
  active: 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]',
  published: 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]',
  paid: 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]',
  approved: 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]',
  delivered: 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]',
  processing: 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6]',
  pending: 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]',
  shipped: 'bg-[rgba(139,148,158,0.15)] text-[#8B949E]',
  draft: 'bg-[rgba(139,148,158,0.15)] text-[#8B949E]',
  inactive: 'bg-[rgba(139,148,158,0.15)] text-[#8B949E]',
  canceled: 'bg-[rgba(239,68,68,0.15)] text-[#EF4444]',
  archived: 'bg-[rgba(239,68,68,0.15)] text-[#EF4444]',
  rejected: 'bg-[rgba(239,68,68,0.15)] text-[#EF4444]',
  refunded: 'bg-[rgba(239,68,68,0.15)] text-[#EF4444]',
  frozen: 'bg-[rgba(239,68,68,0.15)] text-[#EF4444]',
  failed: 'bg-[rgba(239,68,68,0.15)] text-[#EF4444]',
  silver: 'bg-[rgba(192,192,192,0.15)] text-[#C0C0C0]',
  gold: 'bg-[rgba(255,215,0,0.15)] text-[#FFD700]',
  platinum: 'bg-[rgba(229,228,226,0.15)] text-[#E5E4E2]',
  diamond: 'bg-[rgba(185,242,255,0.15)] text-[#B9F2FF]',
}

export default function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status.toLowerCase()] || 'bg-[rgba(139,148,158,0.15)] text-[#8B949E]'
  return (
    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full capitalize ${style}`}>
      {status}
    </span>
  )
}
