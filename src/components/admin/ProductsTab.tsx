import { useState, useRef } from 'react'
import { Search, Plus, Edit2, Trash2, AlertTriangle, Image, Upload, X } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import type { Product } from '@/hooks/useProducts'
import StatusBadge from './StatusBadge'

const categories = ['All', 'E-Bikes', 'E-Scooters', 'Accessories', 'Parts']
const catOptions = ['E-Bikes', 'E-Scooters', 'Accessories', 'Parts']

const CAT_SLUG: Record<string, string> = {
  'E-Bikes': 'e-bikes', 'E-Scooters': 'e-scooters',
  'Accessories': 'accessories', 'Parts': 'parts',
}

export default function ProductsTab() {
  const { products, add, update, remove, stats } = useProducts()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [formName, setFormName] = useState('')
  const [formCategory, setFormCategory] = useState('E-Bikes')
  const [formStatus, setFormStatus] = useState<'active' | 'draft' | 'archived'>('active')
  const [formPrice, setFormPrice] = useState('')
  const [formSalePrice, setFormSalePrice] = useState('')
  const [formStock, setFormStock] = useState('')
  const [formLowStock, setFormLowStock] = useState('5')
  const [formDescription, setFormDescription] = useState('')
  const [formImage, setFormImage] = useState<string>('')

  const resetForm = () => {
    setFormName(''); setFormCategory('E-Bikes'); setFormStatus('active')
    setFormPrice(''); setFormSalePrice(''); setFormStock('')
    setFormLowStock('5'); setFormDescription(''); setFormImage('')
    setEditId(null); setShowForm(false)
  }

  const openAdd = () => { resetForm(); setShowForm(true) }

  const openEdit = (p: Product) => {
    setEditId(p.id); setFormName(p.name); setFormCategory(p.category === 'e-bikes' ? 'E-Bikes' : p.category === 'e-scooters' ? 'E-Scooters' : p.category === 'accessories' ? 'Accessories' : 'Parts')
    setFormStatus(p.status); setFormPrice(p.price); setFormSalePrice(p.salePrice || '')
    setFormStock(String(p.stock)); setFormLowStock(String(p.lowStock)); setFormDescription(p.description); setFormImage(p.image || '')
    setShowForm(true)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { alert('Please select an image'); return }
    if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return }
    const reader = new FileReader()
    reader.onload = (ev) => setFormImage(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (!formName || !formPrice || !formStock) return
    const slug = formName.toLowerCase().replace(/\s+/g, '-')
    const categorySlug = CAT_SLUG[formCategory] || 'e-bikes'
    if (editId !== null) {
      update(editId, {
        name: formName, slug, category: categorySlug, status: formStatus,
        price: formPrice, salePrice: formSalePrice || undefined,
        stock: parseInt(formStock), lowStock: parseInt(formLowStock) || 5,
        description: formDescription, image: formImage || undefined,
      })
    } else {
      add({
        name: formName, slug, category: categorySlug, status: formStatus,
        price: formPrice, salePrice: formSalePrice || undefined,
        stock: parseInt(formStock), lowStock: parseInt(formLowStock) || 5,
        description: formDescription, image: formImage || undefined,
        rating: 0, sales: 0, reviewCount: 0,
      })
    }
    resetForm()
  }

  const handleDelete = (id: number) => { if (confirm('Delete?')) remove(id) }

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === 'All' || p.category === (CAT_SLUG[catFilter] || catFilter.toLowerCase())
    return matchSearch && matchCat
  })

  const lowStock = products.filter((p) => p.stock <= p.lowStock)

  return (
    <div className="space-y-6">
      {lowStock.length > 0 && (
        <div className="bg-[rgba(245,158,11,0.05)] border border-[#F59E0B]/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} className="text-[#F59E0B]" />
            <h3 className="text-[#F59E0B] font-medium text-sm">Low Stock ({lowStock.length})</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.map((p) => (
              <div key={p.id} className="bg-[#161B22] border border-[#F59E0B]/20 rounded-lg px-3 py-2">
                <span className="text-white text-xs">{p.name}</span>
                <span className="text-[#F59E0B] text-xs font-medium ml-2">{p.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total },
          { label: 'Active', value: stats.active },
          { label: 'Low Stock', value: stats.lowStock },
          { label: 'Sales', value: stats.totalSales },
        ].map((s) => (
          <div key={s.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4">
            <p className="text-[11px] uppercase tracking-wider text-[#484F58]">{s.label}</p>
            <p className="text-white font-semibold text-xl mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-[#01D7D5] text-black font-medium text-sm rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] transition-all">
          <Plus size={16} /> Add Product
        </button>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484F58]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
            className="w-full bg-[#161B22] border border-[#30363D] text-white text-sm rounded-lg pl-9 pr-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
        </div>
        <div className="flex gap-1">
          {categories.map((c) => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-3 py-2 rounded-lg text-xs transition-colors ${catFilter === c ? 'bg-[rgba(1,215,213,0.15)] text-[#01D7D5]' : 'text-[#484F58] hover:text-white'}`}>{c}</button>
          ))}
        </div>
      </div>

      <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#484F58] text-xs uppercase tracking-wider bg-[#0A0A0A]">
                {['Image', 'Product', 'Category', 'Price', 'Stock', 'Status', 'Rating', 'Sales', ''].map((h) => <th key={h} className="text-left py-3 px-3 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-[#30363D]/50 hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="py-2 px-3">
                    <div className="w-12 h-12 rounded-lg bg-[#0A0A0A] border border-[#30363D] flex items-center justify-center overflow-hidden">
                      {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <Image size={16} className="text-[#484F58]" />}
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <p className="text-white text-sm">{p.name}</p>
                    {p.salePrice && <p className="text-[#EF4444] text-[10px]">SALE</p>}
                  </td>
                  <td className="py-2 px-3 text-[#8B949E] text-xs">{p.category}</td>
                  <td className="py-2 px-3 text-white">{parseInt(p.price).toLocaleString()} DZD</td>
                  <td className="py-2 px-3"><span className={`text-xs ${p.stock <= p.lowStock ? 'text-[#F59E0B]' : 'text-white'}`}>{p.stock}</span></td>
                  <td className="py-2 px-3"><StatusBadge status={p.status} /></td>
                  <td className="py-2 px-3 text-yellow-500 text-xs">{p.rating > 0 ? '★'.repeat(Math.round(p.rating)) + ' ' + p.rating : '—'}</td>
                  <td className="py-2 px-3 text-[#8B949E] text-xs">{p.sales}</td>
                  <td className="py-2 px-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-[#484F58] hover:text-[#01D7D5]"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-[#484F58] hover:text-[#EF4444]"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#30363D]">
              <h3 className="text-white font-semibold">{editId !== null ? 'Edit' : 'Add'} Product</h3>
              <button onClick={resetForm} className="text-[#484F58] hover:text-white">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[#8B949E] text-xs mb-2 block">Image</label>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                {formImage ? (
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-xl border border-[#30363D] overflow-hidden"><img src={formImage} className="w-full h-full object-cover" /></div>
                    <button onClick={() => { setFormImage(''); if (fileInputRef.current) fileInputRef.current.value = '' }} className="absolute -top-2 -right-2 w-6 h-6 bg-[#EF4444] text-white rounded-full flex items-center justify-center"><X size={12} /></button>
                  </div>
                ) : (
                  <button onClick={() => fileInputRef.current?.click()} className="w-32 h-32 rounded-xl border-2 border-dashed border-[#30363D] hover:border-[#01D7D5] flex flex-col items-center justify-center gap-2 transition-colors bg-[#0A0A0A]">
                    <Upload size={20} className="text-[#484F58]" />
                    <span className="text-[#484F58] text-[10px]">Upload</span>
                  </button>
                )}
              </div>
              <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Product Name *" className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 focus:border-[#01D7D5] focus:outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)} className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5">
                  {catOptions.map((c) => <option key={c}>{c}</option>)}
                </select>
                <select value={formStatus} onChange={(e) => setFormStatus(e.target.value as 'active' | 'draft' | 'archived')} className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5">
                  <option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} placeholder="Price DZD *" className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5" />
                <input type="number" value={formSalePrice} onChange={(e) => setFormSalePrice(e.target.value)} placeholder="Sale Price" className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" value={formStock} onChange={(e) => setFormStock(e.target.value)} placeholder="Stock *" className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5" />
                <input type="number" value={formLowStock} onChange={(e) => setFormLowStock(e.target.value)} placeholder="Low Stock Alert" className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5" />
              </div>
              <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={2} placeholder="Description" className="w-full bg-[#0A0A0A] border border-[#30363D] text-white rounded-lg px-4 py-2.5 resize-none" />
              <div className="flex gap-3">
                <button onClick={handleSave} className="flex-1 py-3 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)]">{editId !== null ? 'Update' : 'Add'}</button>
                <button onClick={resetForm} className="flex-1 py-3 border border-[#30363D] text-white rounded-lg hover:border-[#01D7D5]">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
