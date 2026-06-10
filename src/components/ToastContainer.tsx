import { useToastStore } from '@/hooks/useToast'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

const typeConfig = {
  success: { border: 'border-l-[#01D7D5]', icon: <CheckCircle size={18} className="text-[#01D7D5]" /> },
  error: { border: 'border-l-[#EF4444]', icon: <XCircle size={18} className="text-[#EF4444]" /> },
  warning: { border: 'border-l-[#F59E0B]', icon: <AlertTriangle size={18} className="text-[#F59E0B]" /> },
  info: { border: 'border-l-[#3B82F6]', icon: <Info size={18} className="text-[#3B82F6]" /> },
}

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-[400px]">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const config = typeConfig[toast.type]
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className={`bg-[#161B22] border border-[#30363D] border-l-[3px] ${config.border} rounded-xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-start gap-3`}
            >
              <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{toast.title}</p>
                <p className="text-[#8B949E] text-xs mt-0.5">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-[#484F58] hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
