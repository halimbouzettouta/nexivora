import { Link } from 'react-router'
import { Instagram, Facebook, Youtube } from 'lucide-react'

const shopLinks = [
  { label: 'Electric Bikes', path: '/store?category=e-bikes' },
  { label: 'E-Scooters', path: '/store?category=e-scooters' },
  { label: 'Accessories', path: '/store?category=accessories' },
  { label: 'Parts', path: '/store?category=parts' },
]

const companyLinks = [
  { label: 'About Us', path: '/about' },
  { label: 'Referral Program', path: '/dashboard' },
  { label: 'Blog', path: '/blog' },
  { label: 'Dealer Map', path: '/dealers' },
  { label: 'Contact', path: '/contact' },
]

const supportLinks = [
  { label: 'Help Center', path: '/contact' },
  { label: 'Warranty Info', path: '/contact' },
  { label: 'Shipping & Returns', path: '/contact' },
  { label: 'Terms of Service', path: '/contact' },
  { label: 'Privacy Policy', path: '/contact' },
]

export default function Footer() {
  return (
    <footer className="w-full bg-black border-t border-[#30363D]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[5vw] pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div>
            <Link to="/" className="text-[#01D7D5] font-semibold text-xl tracking-[0.05em]">
              E-RIDE
            </Link>
            <p className="text-[#8B949E] text-sm mt-2">Algeria&apos;s Electric Future</p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-[#484F58] hover:text-[#01D7D5] transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-[#484F58] hover:text-[#01D7D5] transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-[#484F58] hover:text-[#01D7D5] transition-colors duration-300">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-white font-medium text-sm mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-[#8B949E] text-sm hover:text-[#01D7D5] transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-white font-medium text-sm mb-4">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-[#8B949E] text-sm hover:text-[#01D7D5] transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-white font-medium text-sm mb-4">Support</h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-[#8B949E] text-sm hover:text-[#01D7D5] transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#30363D] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#484F58] text-xs">&copy; 2025 E-Ride Algeria. All rights reserved.</p>
          <p className="text-[#484F58] text-xs">Powered by clean energy.</p>
        </div>
      </div>
    </footer>
  )
}
