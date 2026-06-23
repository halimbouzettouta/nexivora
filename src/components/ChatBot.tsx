import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const botResponses: Record<string, string[]> = {
  en: {
    greeting: ["Hello! Welcome to Nexivora. How can I help you today?"],
    products: ["We offer a wide range of electric bikes and scooters. Visit our Store page to browse the collection! Prices start from DZD 45,000."],
    price: ["Our e-bikes range from DZD 45,000 to DZD 350,000. E-scooters start at DZD 85,000. Check the Store for current prices and offers!"],
    shipping: ["We offer free shipping on orders over DZD 50,000. Standard delivery is 3-5 business days, express is 1-2 days."],
    warranty: ["All our products come with a 1-year warranty. You can also purchase extended warranty plans for additional coverage."],
    referral: ["Join our referral program and earn 5% commission on every sale! Sign up as a marketer on our login page."],
    contact: ["You can reach us via email or phone. Our team is available 24/7."],
    order: ["You can track your order from the Order Tracking page. Enter your order number to see the current status."],
    store: ["Visit our Store to browse all products. We have e-bikes, e-scooters, accessories, and spare parts!"],
    payment: ["We accept Cash on Delivery (COD) and credit card payments. Choose your preferred method at checkout."],
    default: ["I'm here to help! Ask me about our products, pricing, shipping, referral program, or anything else."],
  },
  ar: {
    greeting: ["مرحباً! أهلاً بك في نكسيفورا. كيف يمكنني مساعدتك؟"],
    products: ["نقدم مجموعة واسعة من الدراجات والسكوترات الكهربائية. قم بزيارة صفحة المتجر لتصفح المجموعة! الأسعار تبدأ من 45,000 دج."],
    price: ["دراجاتنا الكهربائية تتراوح من 45,000 إلى 350,000 دج. السكوترات تبدأ من 85,000 دج. تفقد المتجر للأسعار الحالية!"],
    shipping: ["نقدم شحن مجاني للطلبات فوق 50,000 دج. التوصيل العادي 3-5 أيام عمل، السريع 1-2 يوم."],
    warranty: ["جميع منتجاتنا تأتي بضمان سنة. يمكنك أيضاً شراء خطط ضمان ممتدة."],
    referral: ["انضم لبرنامج الإحالة واحصل على عمولة 5% على كل عملية بيع! سجل كمسوق في صفحة تسجيل الدخول."],
    contact: ["يمكنك التواصل معنا عبر البريد الإلكتروني أو الاتصال بفريق الدعم. فريقنا متاح على مدار الساعة."],
    order: ["يمكنك تتبع طلبك من صفحة تتبع الطلبات. أدخل رقم طلبك لمعرفة الحالة."],
    store: ["قم بزيارة متجرنا لتصفح جميع المنتجات. لدينا دراجات كهربائية وسكوترات وإكسسوارات وقطع غيار!"],
    payment: ["نقبل الدفع عند الاستلام والبطاقات الائتمانية. اختر طريقتك المفضلة عند الدفع."],
    default: ["أنا هنا للمساعدة! اسألني عن منتجاتنا، الأسعار، الشحن، برنامج الإحالة، أو أي شيء آخر."],
  },
  fr: {
    greeting: ["Bonjour ! Bienvenue chez Nexivora. Comment puis-je vous aider ?"],
    products: ["Nous proposons une large gamme de vélos et trottinettes électriques. Visitez notre Boutique pour parcourir la collection ! À partir de 45 000 DZD."],
    price: ["Nos vélos électriques vont de 45 000 à 350 000 DZD. Les trottinettes commencent à 85 000 DZD. Consultez la Boutique pour les prix actuels !"],
    shipping: ["Livraison gratuite pour les commandes supérieures à 50 000 DZD. Livraison standard 3-5 jours, express 1-2 jours."],
    warranty: ["Tous nos produits sont garantis 1 an. Vous pouvez aussi acheter des extensions de garantie."],
    referral: ["Rejoignez notre programme de parrainage et gagnez 5% de commission sur chaque vente ! Inscrivez-vous comme marketer."],
    contact: ["Contactez-nous par email ou téléphone. Notre équipe est disponible 24/7."],
    order: ["Vous pouvez suivre votre commande sur la page Suivi de Commande. Entrez votre numéro pour voir le statut."],
    store: ["Visitez notre Boutique pour voir tous les produits. Vélos électriques, trottinettes, accessoires et pièces détachées !"],
    payment: ["Nous acceptons le paiement à la livraison et les cartes de crédit. Choisissez votre méthode préférée au paiement."],
    default: ["Je suis là pour vous aider ! Demandez-moi nos produits, tarifs, livraison, programme de parrainage, ou autre chose."],
  },
}

function getBotResponse(input: string, lang: string): string {
  const responses = botResponses[lang as keyof typeof botResponses] || botResponses.en
  const lower = input.toLowerCase()

  if (lower.match(/hi|hello|hey|bonjour|salut|مرحب/)) return responses.greeting[0]
  if (lower.match(/product|bike|scooter|velo|trottinette|دراج|سكوتر/)) return responses.products[0]
  if (lower.match(/price|cost|how much|prix|combien|سعر|كم/)) return responses.price[0]
  if (lower.match(/shipping|delivery|livraison|توصيل|شحن/)) return responses.shipping[0]
  if (lower.match(/warranty|guarantee|garantie|ضمان/)) return responses.warranty[0]
  if (lower.match(/referral|commission|marketer|parrain|إحالة|مسوق/)) return responses.referral[0]
  if (lower.match(/contact|phone|email|tel|اتصال|هاتف/)) return responses.contact[0]
  if (lower.match(/order|track|commande|suivi|طلب|تتبع/)) return responses.order[0]
  if (lower.match(/store|shop|boutique|متجر/)) return responses.store[0]
  if (lower.match(/payment|pay|paiement|دفع/)) return responses.payment[0]

  return responses.default[0]
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [hasGreeted, setHasGreeted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { lang } = useLanguage()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleOpen = () => {
    setIsOpen(true)
    if (!hasGreeted) {
      const greeting = getBotResponse('hello', lang)
      setMessages([{ id: 'greet', text: greeting, sender: 'bot', timestamp: new Date() }])
      setHasGreeted(true)
    }
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      text: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    }

    const botText = getBotResponse(input, lang)
    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      text: botText,
      sender: 'bot',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg, botMsg])
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend()
  }

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#01D7D5] rounded-full flex items-center justify-center shadow-lg hover:shadow-[0_0_30px_rgba(1,215,213,0.5)] hover:scale-105 transition-all"
      >
        <MessageCircle size={24} className="text-black" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] bg-[#161B22] border border-[#30363D] rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ height: '500px', maxHeight: 'calc(100vh - 100px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0A0A0A] border-b border-[#30363D]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[rgba(1,215,213,0.15)] rounded-full flex items-center justify-center">
            <Bot size={16} className="text-[#01D7D5]" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Nexivora Assistant</p>
            <p className="text-[#01D7D5] text-[10px]">Online</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-1 text-[#484F58] hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-[#30363D]' : 'bg-[rgba(1,215,213,0.15)]'}`}>
              {msg.sender === 'user' ? <User size={12} className="text-[#8B949E]" /> : <Bot size={12} className="text-[#01D7D5]" />}
            </div>
            <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${msg.sender === 'user' ? 'bg-[#01D7D5] text-black' : 'bg-[#0A0A0A] text-[#8B949E] border border-[#30363D]'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-[#30363D] bg-[#0A0A0A]">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={lang === 'ar' ? 'اكتب رسالة...' : lang === 'fr' ? 'Écrivez un message...' : 'Type a message...'}
            className="flex-1 bg-[#161B22] border border-[#30363D] text-white rounded-lg px-3 py-2 text-sm focus:border-[#01D7D5] focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="p-2 bg-[#01D7D5] rounded-lg hover:shadow-[0_0_15px_rgba(1,215,213,0.4)] transition-all"
          >
            <Send size={16} className="text-black" />
          </button>
        </div>
      </div>
    </div>
  )
}
