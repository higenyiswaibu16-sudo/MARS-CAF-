import { createFileRoute, Link } from '@tanstack/react-router'
import { FaArrowRight, FaStar, FaQuoteLeft, FaPlus, FaMinus } from 'react-icons/fa'
import { useSettings } from '~/context/SettingsContext'
import { useReviews } from '~/context/ReviewsContext'
import { useCart } from '~/context/CartContext'
import { useMenu } from '~/context/MenuContext'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { settings, gallery, logo } = useSettings()
  const { reviews, addReview } = useReviews()
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart()
  const { menuItems } = useMenu()
  
  const [reviewForm, setReviewForm] = useState({ name: '', text: '', rating: 5 })
  const [showReviewForm, setShowReviewForm] = useState(false)

  const featuredMeals = menuItems.filter(item => item.isBestSeller).slice(0, 3)
  // If no best sellers, just take first 3
  const displayMeals = featuredMeals.length > 0 ? featuredMeals : menuItems.slice(0, 3)

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewForm.name || !reviewForm.text) return
    addReview(reviewForm)
    setReviewForm({ name: '', text: '', rating: 5 })
    setShowReviewForm(false)
    alert('Thank you for your review!')
  }

  const getItemQuantity = (id: string) => {
    return cart.find(item => item.id === id)?.quantity || 0
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover brightness-40"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          {logo && (
            <div className="flex justify-center mb-8">
              <img 
                src={logo} 
                alt="Cafe Logo" 
                className="h-32 w-32 md:h-40 md:w-40 object-contain animate-in fade-in zoom-in duration-1000 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] bg-black/20 p-2 rounded-full backdrop-blur-sm border border-white/10" 
              />
            </div>
          )}
          <div className="mb-4 inline-block bg-green-600/20 backdrop-blur-md border border-green-600/30 px-6 py-2 rounded-full text-green-400 font-bold tracking-widest text-sm uppercase">
            {settings.openHours} in {settings.location.split(',')[0]}
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight uppercase leading-tight">
            {settings.name.split(' ')[0]} <span style={{ color: settings.themeColor }}>{settings.name.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-zinc-200 font-medium">
            Experience the finest flavors in town. From traditional local dishes to modern fast food favorites.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/menu"
              className="hover:opacity-90 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
              style={{ backgroundColor: settings.themeColor }}
            >
              Order Now <FaArrowRight />
            </Link>
            <a
              href={`https://wa.me/${settings.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 px-10 py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* Featured Meals */}
      {displayMeals.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="font-black tracking-widest text-sm uppercase mb-4 block" style={{ color: settings.themeColor }}>Our Specialties</span>
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-4">Chef's Recommendations</h2>
              <div className="h-1.5 w-24 mx-auto rounded-full" style={{ backgroundColor: settings.themeColor }}></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {displayMeals.map((meal) => {
                const quantity = getItemQuantity(meal._id)
                return (
                  <div key={meal._id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-zinc-100 p-3 flex flex-col">
                    <div className="h-72 overflow-hidden relative rounded-[2rem]">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white font-black px-5 py-2 rounded-full text-sm">
                        UGX {meal.price.toLocaleString()}
                      </div>
                      {quantity > 0 && (
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
                          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/50 font-black" style={{ color: settings.themeColor }}>
                            {quantity} IN CART
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-2xl font-black mb-2 group-hover:text-green-600 transition-colors">{meal.name}</h3>
                      <p className="text-zinc-500 mb-6 line-clamp-2 leading-relaxed flex-1">{meal.description}</p>
                      
                      <div className="flex flex-col gap-4">
                        {quantity === 0 ? (
                          <button
                            onClick={() => addToCart({ id: meal._id, name: meal.name, price: meal.price, image: meal.image })}
                            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                          >
                            <FaPlus size={12} /> Add to Cart
                          </button>
                        ) : (
                          <div className="flex items-center justify-between bg-zinc-100 rounded-2xl p-1 border border-zinc-200">
                            <button
                              onClick={() => quantity === 1 ? removeFromCart(meal._id) : updateQuantity(meal._id, -1)}
                              className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-zinc-600 hover:text-red-500 transition-all"
                            >
                              <FaMinus size={14} />
                            </button>
                            <span className="font-black text-lg text-zinc-900">{quantity}</span>
                            <button
                              onClick={() => updateQuantity(meal._id, 1)}
                              className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-zinc-600 transition-all"
                              style={{ color: settings.themeColor }}
                            >
                              <FaPlus size={14} />
                            </button>
                          </div>
                        )}
                        
                        <Link
                          to="/menu"
                          className="text-center text-zinc-400 text-sm font-bold hover:text-zinc-600 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="text-center mt-16">
              <Link
                to="/menu"
                className="inline-block bg-zinc-900 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-green-600 transition-all shadow-xl active:scale-95"
              >
                Explore Full Menu
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {gallery.length > 0 && (
        <section className="py-24 bg-zinc-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="font-black tracking-widest text-sm uppercase mb-4 block" style={{ color: settings.themeColor }}>{settings.gallerySubtitle}</span>
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-4">{settings.galleryTitle}</h2>
              <div className="h-1.5 w-24 mx-auto rounded-full" style={{ backgroundColor: settings.themeColor }}></div>
            </div>
            
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {gallery.map((item) => (
                <div key={item._id} className="break-inside-avoid rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-zinc-100 group">
                  <img 
                    src={item.image} 
                    alt="Gallery item" 
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="py-24 bg-zinc-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20" style={{ backgroundColor: settings.themeColor }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6 text-center md:text-left">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">Happy Customers</h2>
              <div className="h-1.5 w-24 mx-auto md:mx-0 rounded-full" style={{ backgroundColor: settings.themeColor }}></div>
            </div>
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="hover:opacity-90 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg active:scale-95"
              style={{ backgroundColor: settings.themeColor }}
            >
              {showReviewForm ? 'Close Form' : 'Write a Review'}
            </button>
          </div>

          {showReviewForm && (
            <div className="max-w-2xl mx-auto mb-16 bg-zinc-900 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
              <h3 className="text-2xl font-bold mb-6">Leave your feedback</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Your Name</label>
                  <input 
                    type="text" 
                    required 
                    value={reviewForm.name} 
                    onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                    className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Rating</label>
                  <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                        className={`text-2xl transition-all ${reviewForm.rating >= star ? 'scale-110' : 'text-zinc-700'}`}
                        style={{ color: reviewForm.rating >= star ? settings.themeColor : undefined }}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Review</label>
                  <textarea 
                    required 
                    value={reviewForm.text} 
                    onChange={(e) => setReviewForm({...reviewForm, text: e.target.value})}
                    className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-700 h-32"
                    placeholder="Tell us about your experience..."
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all"
                  style={{ backgroundColor: settings.themeColor }}
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review._id} className="bg-zinc-900/50 backdrop-blur-sm p-10 rounded-[2.5rem] relative border border-white/5 transition-all">
                <span className="text-3xl mb-8 opacity-20 block flex items-center" style={{ color: settings.themeColor }}>
                  <FaQuoteLeft />
                </span>
                <p className="text-lg italic mb-8 text-zinc-300 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                  <div>
                    <span className="font-bold text-white block">{review.name}</span>
                    <span className="text-xs text-zinc-500">{review.date}</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`flex items-center ${i < review.rating ? '' : 'text-zinc-700'}`} style={{ color: i < review.rating ? settings.themeColor : undefined }}>
                        <FaStar size={14} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16" style={{ backgroundColor: settings.themeColor }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-around items-center text-center gap-10 text-zinc-950">
          <div>
            <span className="text-5xl font-black block mb-2">24/7</span>
            <span className="text-sm font-black opacity-60 uppercase tracking-[0.3em]">{settings.openHours.split(',')[0]}</span>
          </div>
          <div className="h-16 w-px bg-black/10 hidden md:block"></div>
          <div>
            <span className="text-5xl font-black block mb-2">{settings.location.split(',')[0]}</span>
            <span className="text-sm font-black opacity-60 uppercase tracking-[0.3em]">Our Primary Home</span>
          </div>
          <div className="h-16 w-px bg-black/10 hidden md:block"></div>
          <div>
            <span className="text-5xl font-black block mb-2">5.0</span>
            <span className="text-sm font-black opacity-60 uppercase tracking-[0.3em]">Customer Rating</span>
          </div>
        </div>
      </section>
    </div>
  )
}
