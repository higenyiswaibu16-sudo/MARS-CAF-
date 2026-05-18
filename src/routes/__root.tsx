import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  Link,
} from '@tanstack/react-router'
import * as React from 'react'
import type { QueryClient } from '@tanstack/react-query'
import appCss from '~/styles/app.css?url'
import { CartProvider, useCart } from '~/context/CartContext'
import { MenuProvider, useMenu } from '~/context/MenuContext'
import { SettingsProvider, useSettings } from '~/context/SettingsContext'
import { ReviewsProvider } from '~/context/ReviewsContext'
import { FaWhatsapp, FaShoppingCart, FaBars, FaTimes, FaLock, FaShareAlt } from 'react-icons/fa'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Mars Cafe Gardens',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/MARS-CAF-/favicon.ico' },
    ],
  }),
  notFoundComponent: () => <div>Route not found</div>,
  component: RootComponent,
})

function Navbar() {
  const { cart } = useCart()
  const { isAdmin, setIsAdmin } = useMenu()
  const { settings, logo } = useSettings()
  const [isOpen, setIsOpen] = React.useState(false)
  const [logoClicks, setLogoClicks] = React.useState(0)
  
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  const handleLogoClick = () => {
    const newCount = logoClicks + 1
    if (newCount >= 5) {
      const pass = prompt('Enter Admin Password:')
      if (pass === 'marsadmin') {
        setIsAdmin(!isAdmin)
        alert(isAdmin ? 'Admin Mode Disabled' : 'Admin Mode Enabled! You can now manage the menu, settings, and logo.')
        setLogoClicks(0)
      } else {
        alert('Access Denied')
        setLogoClicks(0)
      }
    } else {
      setLogoClicks(newCount)
      setTimeout(() => setLogoClicks(0), 2000)
    }
  }

  const nameParts = settings.name.split(' ')
  const firstName = nameParts[0] || 'MARS'
  const restName = nameParts.slice(1).join(' ') || 'CAFE GARDENS'

  return (
    <nav className="bg-black text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            {logo && (
              <img src={logo} alt="Cafe Logo" className="h-12 w-12 object-contain rounded-lg border border-white/10" />
            )}
            <button 
              onClick={handleLogoClick}
              className="text-2xl font-bold tracking-wider hover:opacity-80 transition-opacity text-left uppercase"
              style={{ color: settings.themeColor === '#ffffff' ? '#eab308' : settings.themeColor }}
            >
              {firstName} <span className={settings.themeColor === '#ffffff' ? 'text-zinc-400' : 'text-white opacity-80'}>{restName}</span>
            </button>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="hover:text-yellow-500 px-3 py-2 transition-colors">Home</Link>
              <Link to="/menu" className="hover:text-yellow-500 px-3 py-2 transition-colors">Menu</Link>
              <Link to="/contact" className="hover:text-yellow-500 px-3 py-2 transition-colors">Contact</Link>
              {isAdmin && (
                <Link to="/admin" className="text-yellow-500 border border-yellow-500/30 px-3 py-1 rounded-lg flex items-center gap-2 hover:bg-yellow-500 hover:text-black transition-all">
                  <FaLock size={12} /> Admin
                </Link>
              )}
              <Link to="/cart" className="relative group px-3 py-2">
                <span className="flex items-center text-2xl group-hover:text-yellow-500 transition-colors">
                  <FaShoppingCart />
                </span>
                {cartCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm"
                    style={{ backgroundColor: settings.themeColor === '#ffffff' ? '#eab308' : settings.themeColor }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
          <div className="md:hidden flex items-center gap-4">
             {isAdmin && (
                <Link to="/admin" className="p-2 border rounded-lg transition-colors" style={{ color: settings.themeColor, borderColor: `${settings.themeColor}33` }}>
                  <FaLock size={16} />
                </Link>
              )}
            <Link to="/cart" className="relative">
              <span className="flex items-center text-2xl" style={{ color: settings.themeColor === '#ffffff' ? '#eab308' : settings.themeColor }}>
                <FaShoppingCart />
              </span>
              {cartCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm"
                  style={{ backgroundColor: settings.themeColor === '#ffffff' ? '#eab308' : settings.themeColor }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-yellow-500">
              {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-900 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium border-b border-zinc-800">Home</Link>
          <Link to="/menu" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium border-b border-zinc-800">Menu</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium border-b border-zinc-800">Contact</Link>
          {isAdmin && (
            <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium border-b border-zinc-800 text-yellow-500">Owner Panel</Link>
          )}
        </div>
      )}
    </nav>
  )
}

function Footer() {
  const { settings, logo } = useSettings()
  return (
    <footer className="bg-black text-white pt-12 pb-8 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            {logo && (
              <img src={logo} alt="Logo" className="h-10 w-10 object-contain rounded" />
            )}
            <h3 className="text-xl font-bold" style={{ color: settings.themeColor }}>{settings.name}</h3>
          </div>
          <p className="text-zinc-400">Experience the best flavors in {settings.location.split(',')[0]}. {settings.openHours} to serve you anytime.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4" style={{ color: settings.themeColor }}>Quick Links</h3>
          <ul className="space-y-2 text-zinc-400">
            <li><Link to="/" className="hover:opacity-80">Home</Link></li>
            <li><Link to="/menu" className="hover:opacity-80">Our Menu</Link></li>
            <li><Link to="/contact" className="hover:opacity-80">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4" style={{ color: settings.themeColor }}>Contact Info</h3>
          <p className="text-zinc-400">{settings.location}</p>
          <p className="text-zinc-400">Phone: {settings.phone}</p>
          <p className="text-zinc-400">Email: {settings.email}</p>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-zinc-500 text-sm">
        &copy; {new Date().getFullYear()} {settings.name}. All rights reserved.
      </div>
    </footer>
  )
}

function WhatsAppButton() {
  const { settings } = useSettings()
  const cleanPhone = settings.phone.replace(/[^0-9]/g, '')
  return (
    <a
      href={`https://wa.me/${cleanPhone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 text-white p-4 rounded-full shadow-2xl hover:opacity-90 transition-all hover:scale-110 z-[60] flex items-center justify-center animate-bounce"
      style={{ backgroundColor: settings.themeColor === '#ffffff' ? '#22c55e' : settings.themeColor }}
    >
      <FaWhatsapp size={32} />
    </a>
  )
}

function ShareButton() {
  const { settings } = useSettings()
  const [copied, setCopied] = React.useState(false)
  
  const handleShare = async () => {
    const appUrl = 'https://higenyiswaibu16-sudo.github.io/MARS-CAF-/'
    const shareData = {
      title: settings.name,
      text: `Check out ${settings.name} in ${settings.location.split(',')[0]}! They have amazing food and are open 24/7. Order here:`,
      url: appUrl
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(appUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        alert('Could not copy link. Please copy the URL from your browser address bar.')
      }
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {copied && (
        <div className="absolute bottom-full right-0 mb-4 bg-black text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-300">
          Link Copied!
        </div>
      )}
      <button
        onClick={handleShare}
        className="text-white p-4 rounded-full shadow-2xl hover:opacity-90 transition-all hover:scale-110 active:scale-90 flex items-center justify-center group relative overflow-hidden"
        style={{ backgroundColor: settings.themeColor === '#ffffff' ? '#eab308' : settings.themeColor }}
        title="Share Website"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <span className="relative z-10"><FaShareAlt size={32} /></span>
      </button>
    </div>
  )
}

function RootComponent() {
  return (
    <SettingsProvider>
      <ReviewsProvider>
        <MenuProvider>
          <CartProvider>
            <RootDocument>
              <Navbar />
              <div className="min-h-[calc(100vh-80px-300px)]">
                <Outlet />
              </div>
              <Footer />
              <WhatsAppButton />
              <ShareButton />
            </RootDocument>
          </CartProvider>
        </MenuProvider>
      </ReviewsProvider>
    </SettingsProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <base href="/MARS-CAF-/" />
        <HeadContent />
      </head>
      <body className="bg-zinc-50 font-sans antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
