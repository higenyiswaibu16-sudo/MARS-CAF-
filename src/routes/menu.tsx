import { createFileRoute } from '@tanstack/react-router'
import { useCart } from '~/context/CartContext'
import { useMenu } from '~/context/MenuContext'
import { useSettings } from '~/context/SettingsContext'
import { FaPlus, FaMinus, FaSearch, FaStar, FaTrash } from 'react-icons/fa'
import { useState, useMemo } from 'react'

export const Route = createFileRoute('/menu')({
  head: () => ({ meta: [{ title: 'Menu - Mars Cafe Gardens' }] }),
  component: Menu,
})

function Menu() {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart()
  const { menuItems, isAdmin, deleteMenuItem } = useMenu()
  const { settings } = useSettings()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = useMemo(() => ['All', ...Array.from(new Set(menuItems.map(item => item.category)))], [menuItems])

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                           item.description.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [menuItems, search, activeCategory])

  const getItemQuantity = (id: string) => {
    return cart.find(item => item.id === id)?.quantity || 0
  }

  return (
    <div className="bg-zinc-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-black text-white py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-widest">Our <span style={{ color: settings.themeColor }}>Menu</span></h1>
        <p className="text-zinc-400 max-w-2xl mx-auto px-4 italic">Delicious Ugandan flavors and international favorites, prepared fresh 24 hours a day.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-zinc-100 mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:w-96">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 flex items-center">
                <FaSearch />
              </span>
              <input
                type="text"
                placeholder="Search for dishes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:ring-2 transition-all"
                style={{ borderColor: search ? settings.themeColor : undefined }}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                    activeCategory === cat 
                    ? 'text-white shadow-lg scale-105' 
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                  style={{ backgroundColor: activeCategory === cat ? settings.themeColor : undefined }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredItems.map((item) => {
              const quantity = getItemQuantity(item._id)
              
              return (
                <div key={item._id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-zinc-100 flex flex-col relative">
                  {item.isBestSeller && (
                    <div className="absolute top-4 left-4 z-20 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-lg">
                      <span className="flex items-center"><FaStar size={10} /></span> BEST SELLER
                    </div>
                  )}
                  
                  {isAdmin && (
                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                      <button 
                        onClick={() => {
                          if (window.confirm('Delete this dish?')) {
                            deleteMenuItem(item._id)
                          }
                        }}
                        className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors flex items-center"
                        title="Delete Item"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  )}

                  <div className="h-56 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    {quantity > 0 && (
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/50 font-black" style={{ color: settings.themeColor }}>
                          {quantity} IN CART
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: settings.themeColor }}>{item.category}</span>
                        <h3 className="font-bold text-xl text-zinc-900 leading-tight">{item.name}</h3>
                      </div>
                      <span className="text-yellow-600 font-black text-lg whitespace-nowrap ml-2">
                        {item.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-sm mb-6 flex-1 line-clamp-3">{item.description}</p>
                    
                    {quantity === 0 ? (
                      <button
                        onClick={() => addToCart({ id: item._id, name: item.name, price: item.price, image: item.image })}
                        className="w-full bg-zinc-900 hover:opacity-90 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                        style={{ backgroundColor: settings.themeColor }}
                      >
                        <span className="flex items-center"><FaPlus size={12} /></span> Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center justify-between bg-zinc-100 rounded-2xl p-1.5 border border-zinc-200">
                          <button
                            onClick={() => {
                              if (quantity === 1) {
                                removeFromCart(item._id)
                              } else {
                                updateQuantity(item._id, -1)
                              }
                            }}
                            className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-zinc-600 hover:text-red-500 hover:shadow-md transition-all active:scale-90"
                          >
                            <FaMinus size={14} />
                          </button>
                          <span className="font-black text-lg text-zinc-900">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, 1)}
                            className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm transition-all active:scale-90"
                            style={{ color: settings.themeColor }}
                          >
                            <FaPlus size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-zinc-400 text-xl font-medium">No dishes found matching your criteria.</p>
            <button 
              onClick={() => { setSearch(''); setActiveCategory('All'); }}
              className="mt-4 font-bold hover:underline"
              style={{ color: settings.themeColor }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
