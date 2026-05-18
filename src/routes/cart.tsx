import { createFileRoute, Link } from '@tanstack/react-router'
import { useCart } from '~/context/CartContext'
import { useSettings } from '~/context/SettingsContext'
import { FaTrash, FaMinus, FaPlus, FaWhatsapp, FaArrowLeft } from 'react-icons/fa'

export const Route = createFileRoute('/cart')({
  head: () => ({ meta: [{ title: 'Cart - Mars Cafe Gardens' }] }),
  component: Cart,
})

function Cart() {
  const { cart, removeFromCart, updateQuantity, total } = useCart()
  const { settings } = useSettings()

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return

    const message = `Hello ${settings.name}, I'd like to place an order:%0A%0A` +
      cart.map(item => `- ${item.name} (x${item.quantity}): UGX ${(item.price * item.quantity).toLocaleString()}`).join('%0A') +
      `%0A%0A*Total: UGX ${total.toLocaleString()}*%0A%0AThank you!`;

    const cleanPhone = settings.phone.replace(/[^0-9]/g, '')
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="bg-zinc-100 p-8 rounded-full mb-6">
          <span className="text-4xl text-zinc-400 rotate-45 block flex items-center">
            <FaPlus />
          </span>
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Your cart is empty</h2>
        <p className="text-zinc-500 mb-8">Browse our menu and add some delicious meals!</p>
        <Link
          to="/menu"
          className="text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-all shadow-lg active:scale-95"
          style={{ backgroundColor: settings.themeColor }}
        >
          View Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-zinc-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/menu" className="text-zinc-500 hover:text-zinc-900 transition-colors">
            <FaArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900">Your <span style={{ color: settings.themeColor }}>Cart</span></h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-zinc-900">{item.name}</h3>
                  <p className="font-bold text-sm" style={{ color: settings.themeColor }}>UGX {item.price.toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-zinc-300 hover:text-red-500 transition-colors"
                  >
                    <FaTrash size={14} />
                  </button>
                  <div className="flex items-center gap-3 bg-zinc-100 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:text-red-500 transition-colors"
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm transition-colors"
                      style={{ color: settings.themeColor }}
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 sticky top-24">
              <h2 className="text-xl font-bold mb-6 border-b pb-4">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span>UGX {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Delivery</span>
                  <span className="font-medium" style={{ color: settings.themeColor }}>Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-4 text-zinc-900">
                  <span>Total</span>
                  <span style={{ color: settings.themeColor }}>UGX {total.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-95"
              >
                <FaWhatsapp size={24} /> Place Order via WhatsApp
              </button>
              <p className="text-xs text-zinc-400 text-center mt-4">
                Clicking will open WhatsApp with your order details pre-filled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
