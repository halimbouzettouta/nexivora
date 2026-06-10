import { Link } from 'react-router'
import { Zap, Globe } from 'lucide-react'

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  return (
    <div className="min-h-screen bg-black flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(/hero-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="relative z-10 text-center px-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Zap size={32} className="text-[#01D7D5]" />
            <span className="text-[#01D7D5] font-semibold text-2xl tracking-[0.05em]">E-RIDE</span>
          </div>
          <h2 className="text-white font-semibold text-3xl mb-4">Algeria&apos;s Electric Future</h2>
          <p className="text-[#8B949E] max-w-[400px] mx-auto">
            Join thousands of riders and marketers transforming transportation in Algeria.
          </p>
          <div
            className="mt-8 mx-auto w-[300px] h-[150px]"
            style={{
              background: 'radial-gradient(circle, rgba(1,215,213,0.3) 0%, transparent 60%)',
            }}
          />
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#0A0A0A] px-6">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Zap size={24} className="text-[#01D7D5]" />
            <span className="text-[#01D7D5] font-semibold text-xl tracking-[0.05em]">E-RIDE</span>
          </div>

          <h1 className="text-white font-semibold text-2xl mb-1">Welcome Back</h1>
          <p className="text-[#8B949E] text-sm mb-8">Sign in to your account to continue</p>

          {/* Sign In with Kimi */}
          <button
            onClick={() => { window.location.href = getOAuthUrl(); }}
            className="w-full py-3.5 bg-[#01D7D5] text-black font-medium rounded-lg hover:shadow-[0_0_20px_rgba(1,215,213,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 mb-4"
          >
            <Zap size={18} />
            Sign in with Kimi
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#30363D]" />
            <span className="text-[#484F58] text-xs">or</span>
            <div className="flex-1 h-px bg-[#30363D]" />
          </div>

          {/* Email Form */}
          <div className="space-y-4">
            <div>
              <label className="text-[#8B949E] text-sm mb-1 block">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none focus:ring-1 focus:ring-[#01D7D5]/20 transition-all"
              />
            </div>
            <div>
              <label className="text-[#8B949E] text-sm mb-1 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#161B22] border border-[#30363D] text-white rounded-lg px-4 py-3 focus:border-[#01D7D5] focus:outline-none focus:ring-1 focus:ring-[#01D7D5]/20 transition-all"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-[#8B949E] cursor-pointer">
                <input type="checkbox" className="rounded border-[#30363D] bg-[#161B22] text-[#01D7D5] focus:ring-[#01D7D5]" />
                Remember me
              </label>
              <a href="#" className="text-[#01D7D5] text-sm hover:underline">Forgot Password?</a>
            </div>
            <button className="w-full py-3.5 border border-[#30363D] text-white font-medium rounded-lg hover:border-[#01D7D5] transition-colors duration-300">
              Sign In
            </button>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <Globe size={14} className="text-[#484F58]" />
            <button className="text-[#8B949E] text-sm hover:text-[#01D7D5] transition-colors">English</button>
            <span className="text-[#30363D]">/</span>
            <button className="text-[#484F58] text-sm hover:text-[#01D7D5] transition-colors">العربية</button>
          </div>

          <p className="text-[#484F58] text-sm text-center mt-6">
            Don&apos;t have an account?{' '}
            <a href="#" className="text-[#01D7D5] hover:underline">Sign Up</a>
          </p>

          <div className="text-center mt-6">
            <Link to="/" className="text-[#484F58] text-sm hover:text-[#8B949E] transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
