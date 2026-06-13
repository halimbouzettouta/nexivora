import { useState } from 'react'
import { Search, Printer, Eye, Download } from 'lucide-react'
import { trpc } from '@/providers/trpc'
import StatusBadge from './StatusBadge'

const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Completed', 'Canceled', 'Refunded']

export default function OrdersTab() {
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  const { data: allOrders, isLoading } = trpc.order.list.useQuery({})

  // Calculate stats from real data
  const stats = [
    { label: 'Total Orders', value: allOrders?.length?.toString() || '0', color: '#01D7D5' },
    { label: 'Pending', value: allOrders?.filter(o => o.status === 'pending').length?.toString() || '0', color: '#F59E0B' },
    { label: 'Processing', value: allOrders?.filter(o => o.status === 'processing').length?.toString() || '0', color: '#3B82F6' },
    { label: 'Completed', value: allOrders?.filter(o => o.status === 'delivered' || o.status === 'completed').length?.toString() || '0', color: '#01D7D5' },
  ]

  const filtered = (allOrders || []).filter((o) => {
    const matchStatus = statusFilter === 'All' || o.status === statusFilter.toLowerCase()
    const matchSearch = !search ||
      (o.orderNumber?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (typeof o.shippingAddress === 'object' && o.shippingAddress !== null
        ? (o.shippingAddress as Record<string, string>).fullName?.toLowerCase().includes(search.toLowerCase())
        : false)
    return matchStatus && matchSearch
  })

  const toggleSelect = (id: string) => {
    setSelectedOrders((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  const getCustomerName = (order: any) => {
    if (typeof order.shippingAddress === 'object' && order.shippingAddress !== null) {
      return (order.shippingAddress as Record<string, string>).fullName || 'Unknown'
    }
    return 'Unknown'
  }

  const getCustomerEmail = (order: any) => {
    if (typeof order.shippingAddress === 'object' && order.shippingAddress !== null) {
      return (order.shippingAddress as Record<string, string>).email || ''
    }
    return ''
  }

  const getCity = (order: any) => {
    if (typeof order.shippingAddress === 'object' && order.shippingAddress !== null) {
      return (order.shippingAddress as Record<string, string>).city || ''
    }
    return ''
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#8B949E] text-sm">Loading orders...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4">
            <p className="text-[11px] uppercase tracking-wider text-[#484F58] mb-1">{s.label}</p>
            <p className="text-white font-semibold text-xl" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484F58]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..."
            className="w-full bg-[#161B22] border border-[#30363D] text-white text-sm rounded-lg pl-9 pr-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {statusOptions.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-colors ${statusFilter === s ? 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]' : 'text-[#8B949E] hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-[#30363D] rounded-lg text-sm text-[#8B949E] hover:border-[#01D7D5] hover:text-white transition-colors">
          <Download size={14} /> Export
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="flex items-center gap-3 bg-[rgba(1,215,213,0.05)] border border-[#01D7D5]/20 rounded-lg p-3">
          <span className="text-[#8B949E] text-sm">{selectedOrders.length} selected</span>
          <div className="flex gap-2">
            {['Processing', 'Shipped', 'Delivered', 'Canceled'].map((s) => (
              <button key={s} className="px-3 py-1.5 bg-[#161B22] border border-[#30363D] rounded text-xs text-white hover:border-[#01D7D5] transition-colors">
                Mark {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                <th className="text-left py-3 px-3 w-8"><input type="checkbox" className="rounded border-[#30363D] bg-[#161B22]" /></th>
                <th className="text-left py-3 px-3">Order #</th>
                <th className="text-left py-3 px-3">Customer</th>
                <th className="text-left py-3 px-3">Products</th>
                <th className="text-left py-3 px-3">Total</th>
                <th className="text-left py-3 px-3">Status</th>
                <th className="text-left py-3 px-3">Payment</th>
                <th className="text-left py-3 px-3">Date</th>
                <th className="text-left py-3 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#484F58]">
                    {allOrders?.length === 0 ? 'No orders yet. Orders will appear here when customers place them.' : 'No orders match your filters.'}
                  </td>
                </tr>
              )}
              {filtered.map((o) => (
                <tr key={o.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="py-3 px-3">
                    <input type="checkbox" checked={selectedOrders.includes(String(o.id))} onChange={() => toggleSelect(String(o.id))} className="rounded border-[#30363D] bg-[#161B22]" />
                  </td>
                  <td className="py-3 px-3 text-white font-mono text-xs">{o.orderNumber}</td>
                  <td className="py-3 px-3">
                    <p className="text-white text-sm">{getCustomerName(o)}</p>
                    <p className="text-[#484F58] text-xs">{getCustomerEmail(o)}</p>
                  </td>
                  <td className="py-3 px-3 text-[#8B949E] text-xs max-w-[180px] truncate">{o.products || '—'}</td>
                  <td className="py-3 px-3 text-white">{parseFloat(o.total || '0').toLocaleString()} DZD</td>
                  <td className="py-3 px-3"><StatusBadge status={o.status || 'pending'} /></td>
                  <td className="py-3 px-3 text-[#8B949E] text-xs uppercase">{o.paymentMethod || 'cod'}</td>
                  <td className="py-3 px-3 text-[#484F58] text-xs">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="py-3 px-3">
                    <div className="flex gap-1.5">
                      <button className="p-1.5 text-[#484F58] hover:text-[#01D7D5] transition-colors rounded hover:bg-[rgba(1,215,213,0.1)]"><Eye size={14} /></button>
                      <button className="p-1.5 text-[#484F58] hover:text-white transition-colors rounded hover:bg-[rgba(255,255,255,0.05)]"><Printer size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-[#30363D]">
          <p className="text-[#484F58] text-xs">Showing {filtered.length} of {allOrders?.length || 0} orders</p>
          <div className="flex gap-1">
            {['Prev', '1', 'Next'].map((p) => (
              <button key={p} className={`px-3 py-1.5 rounded text-xs ${p === '1' ? 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]' : 'text-[#484F58] hover:text-white'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
