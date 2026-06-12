import { useState } from 'react'
import { Link } from 'react-router'
import {
  LayoutDashboard, TrendingUp, ShoppingCart, Users, GitBranch, DollarSign, Trophy,
  Package, UserCircle, CreditCard, MapPin, FileText, Bell, Settings, ClipboardList,
  Brain, LogOut
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'

// Import all admin tab components
import OverviewTab from '@/components/admin/OverviewTab'
import SalesTab from '@/components/admin/SalesTab'
import OrdersTab from '@/components/admin/OrdersTab'
import MarketersTab from '@/components/admin/MarketersTab'
import NetworkTab from '@/components/admin/NetworkTab'
import CommissionsTab from '@/components/admin/CommissionsTab'
import RanksTab from '@/components/admin/RanksTab'
import ProductsTab from '@/components/admin/ProductsTab'
import CustomersTab from '@/components/admin/CustomersTab'
import SubscriptionsTab from '@/components/admin/SubscriptionsTab'
import DealersTab from '@/components/admin/DealersTab'
import ContentTab from '@/components/admin/ContentTab'
import NotificationsTab from '@/components/admin/NotificationsTab'
import AnalyticsTab from '@/components/admin/AnalyticsTab'
import SettingsTab from '@/components/admin/SettingsTab'
import AuditLogTab from '@/components/admin/AuditLogTab'

const adminNavItems = [
  { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'sales', label: 'Sales', icon: <TrendingUp size={18} /> },
  { id: 'orders', label: 'Orders', icon: <ShoppingCart size={18} /> },
  { id: 'marketers', label: 'Marketers', icon: <Users size={18} /> },
  { id: 'network', label: 'Network Tree', icon: <GitBranch size={18} /> },
  { id: 'commissions', label: 'Commissions', icon: <DollarSign size={18} /> },
  { id: 'ranks', label: 'Ranks & Rewards', icon: <Trophy size={18} /> },
  { id: 'products', label: 'Products', icon: <Package size={18} /> },
  { id: 'customers', label: 'Customers', icon: <UserCircle size={18} /> },
  { id: 'subscriptions', label: 'Subscriptions', icon: <CreditCard size={18} /> },
  { id: 'dealers', label: 'Dealers', icon: <MapPin size={18} /> },
  { id: 'content', label: 'Content', icon: <FileText size={18} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  { id: 'analytics', label: 'Analytics & AI', icon: <Brain size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  { id: 'audit', label: 'Audit Log', icon: <ClipboardList size={18} /> },
]

export default function AdminDashboard() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')
  const { user, logout } = useAuth()

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />
      case 'sales':
        return <SalesTab />
      case 'orders':
        return <OrdersTab />
      case 'marketers':
        return <MarketersTab />
      case 'network':
        return <NetworkTab />
      case 'commissions':
        return <CommissionsTab />
      case 'ranks':
        return <RanksTab />
      case 'products':
        return <ProductsTab />
      case 'customers':
        return <CustomersTab />
      case 'subscriptions':
        return <SubscriptionsTab />
      case 'dealers':
        return <DealersTab />
      case 'content':
        return <ContentTab />
      case 'notifications':
        return <NotificationsTab />
      case 'analytics':
        return <AnalyticsTab />
      case 'settings':
        return <SettingsTab />
      case 'audit':
        return <AuditLogTab />
      default:
        return <OverviewTab />
    }
  }

  return (
    <div className="min-h-screen bg-black pt-[70px]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-[260px] min-h-[calc(100vh-70px)] bg-[#0A0A0A] border-r border-[#30363D] fixed top-[70px] left-0 bottom-0 overflow-y-auto z-40">
          <Link to="/" className="block px-6 py-5 text-[#01D7D5] font-semibold text-base tracking-[0.05em]">
            E-RIDE
          </Link>
          <div className="px-3 pb-1">
            <span className="px-4 text-[10px] uppercase tracking-wider text-[#484F58] font-medium">Admin</span>
          </div>
          <nav className="px-3 pb-4">
            {adminNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors mb-0.5 ${
                  activeTab === item.id
                    ? 'bg-[rgba(1,215,213,0.1)] text-[#01D7D5]'
                    : 'text-[#8B949E] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
          <div className="px-4 pb-6 mt-auto">
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#EF4444] flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{user?.name || 'Admin'}</p>
                  <p className="text-[#8B949E] text-[11px]">{t('admin.superAdmin')}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full mt-3 flex items-center gap-2 text-[#EF4444] text-sm hover:underline"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 lg:ml-[260px] p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white font-semibold text-xl capitalize">
              {adminNavItems.find((n) => n.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell size={18} className="text-[#8B949E]" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#EF4444] rounded-full" />
              </div>
              <div className="w-8 h-8 rounded-full bg-[#EF4444] flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
            </div>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
