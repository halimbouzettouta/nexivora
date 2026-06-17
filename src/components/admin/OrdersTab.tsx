import { useState } from 'react'
import { Search, Eye, RefreshCw } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { trpc } from '@/providers/trpc'

const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Completed', 'Canceled', 'Refunded']
const statusTransitions: Record<string, string[]> = {
  pending: ['Processing', 'Shipped', 'Canceled'],
  processing: ['Shipped', 'Canceled'],
  shipped: ['Delivered', 'Canceled'],
  delivered: ['Completed'],
  completed: [],
  canceled: [],
  refunded: [],
}

export default function OrdersTab() {
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  // Fetch orders from the REAL API
  const { data: allOrders = [], isLoading, refetch } = trpc.order.list.useQuery(undefined, {
    staleTime: 5000,
    refetchInterval: 10000, // Auto-refresh every 10 seconds
  })

  const utils = trpc.useUtils()

  const stats = {
    total: allOrders.length,
    pending: allOrders.filter((o: any) => o.status === 'pending').length,
    processing: allOrders.filter((o: any) => o.status === 'processing').length,
    delivered: allOrders.filter((o: any) => o.status === 'delivered' || o.status === 'completed').length,
  }

  const statCards = [
    { label: 'Total Orders', value: String(stats.total), color: '#01D7D5' },
    { label: 'Pending', value: String(stats.pending), color: '#F59E0B' },
    { label: 'Processing', value: String(stats.processing), color: '#3B82F6' },
    { label: 'Completed', value: String(stats.delivered), color: '#01D7D5' },
  ]

  const filtered = allOrders.filter((o: any) => {
    const matchStatus = statusFilter === 'All' || o.status === statusFilter.toLowerCase()
    const matchSearch = !search ||
      (o.orderNumber && o.orderNumber.toLowerCase().includes(search.toLowerCase())) ||
      (o.shippingAddress && JSON.stringify(o.shippingAddress).toLowerCase().includes(search.toLowerCase()))
    return matchStatus && matchSearch
  })

  const selectedOrder = allOrders.find((o: any) => o.id === selectedOrderId || o.orderNumber === selectedOrderId)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((s) => (
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
        <button onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2.5 border border-[#30363D] rounded-lg text-sm text-[#8B949E] hover:border-[#01D7D5] hover:text-white transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Table */}
        <div className="lg:col-span-2">
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                    <th className="text-left py-3 px-3">Order #</th>
                    <th className="text-left py-3 px-3">Customer</th>
                    <th className="text-left py-3 px-3">Items</th>
                    <th className="text-left py-3 px-3">Total</th>
                    <th className="text-left py-3 px-3">Status</th>
                    <th className="text-left py-3 px-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr><td colSpan={6} className="py-12 text-center text-[#484F58]">Loading orders...</td></tr>
                  )}
                  {!isLoading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-[#484F58]">
                        {allOrders.length === 0 ? 'No orders yet. Orders appear here when customers check out.' : 'No orders match your filters.'}
                      </td>
                    </tr>
                  )}
                  {filtered.map((o: any) => (
                    <tr key={o.id || o.orderNumber} onClick={() => setSelectedOrderId(o.id || o.orderNumber)}
                      className={`border-t border-[#30363D]/50 cursor-pointer transition-colors ${selectedOrderId === (o.id || o.orderNumber) ? 'bg-[rgba(1,215,213,0.05)]' : 'hover:bg-[rgba(255,255,255,0.02)]'}`}>
                      <td className="py-3 px-3 text-white font-mono text-xs">{o.orderNumber}</td>
                      <td className="py-3 px-3">
                        <p className="text-white text-sm">{o.shippingAddress?.fullName || 'Guest'}</p>
                        <p className="text-[#484F58] text-xs">{o.shippingAddress?.phone || ''}</p>
                      </td>
                      <td className="py-3 px-3 text-[#8B949E] text-xs">{o.products || `${o.itemCount || 0} items`}</td>
                      <td className="py-3 px-3 text-white">{Number(o.total).toLocaleString()} DZD</td>
                      <td className="py-3 px-3"><StatusBadge status={o.status} /></td>
                      <td className="py-3 px-3 text-[#484F58] text-xs">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between p-4 border-t border-[#30363D]">
              <p className="text-[#484F58] text-xs">Showing {filtered.length} of {allOrders.length} orders</p>
            </div>
          </div>
        </div>

        {/* Order Detail Panel */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          {selectedOrder ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">{selectedOrder.orderNumber}</h3>
                <StatusBadge status={selectedOrder.status} />
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-[#8B949E]"><span className="text-[#484F58]">Customer:</span> {selectedOrder.shippingAddress?.fullName || 'Guest'}</p>
                <p className="text-[#8B949E]"><span className="text-[#484F58]">Phone:</span> {selectedOrder.shippingAddress?.phone || '—'}</p>
                <p className="text-[#8B949E]"><span className="text-[#484F58]">Address:</span> {selectedOrder.shippingAddress?.address || '—'}</p>
                <p className="text-[#8B949E]"><span className="text-[#484F58]">City:</span> {selectedOrder.shippingAddress?.city || '—'}</p>
                <p className="text-[#8B949E]"><span className="text-[#484F58]">Payment:</span> {selectedOrder.paymentMethod}</p>
              </div>

              <div className="border-t border-[#30363D] pt-3">
                <p className="text-[#484F58] text-xs uppercase mb-2">Items</p>
                <p className="text-[#8B949E] text-sm">{selectedOrder.products || 'See order details'}</p>
                <div className="border-t border-[#30363D] pt-2 mt-2">
                  <div className="flex justify-between text-sm font-semibold mt-1">
                    <span className="text-white">Total</span>
                    <span className="text-[#01D7D5]">{Number(selectedOrder.total).toLocaleString()} DZD</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Eye size={32} className="text-[#30363D] mx-auto mb-3" />
              <p className="text-[#484F58] text-sm">Select an order to view details and manage status</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
