import { createFileRoute } from '@tanstack/react-router'
import { FaPhone, FaMapMarkerAlt, FaClock, FaEnvelope, FaWhatsapp } from 'react-icons/fa'
import { useSettings } from '~/context/SettingsContext'

export const Route = createFileRoute('/contact')({
  head: () => ({ meta: [{ title: 'Contact Us - Mars Cafe Gardens' }] }),
  component: Contact,
})

function Contact() {
  const { settings } = useSettings()

  return (
    <div className="bg-zinc-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-black text-white py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-widest">Contact <span className="text-yellow-500">Us</span></h1>
        <p className="text-zinc-400 max-w-2xl mx-auto px-4 italic">We're here to serve you 24/7. Reach out for orders, feedback, or inquiries.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-zinc-900 mb-8">Get In Touch</h2>
            
            <div className="flex gap-6 items-start p-6 bg-white rounded-3xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
              <div className="bg-yellow-500 p-4 rounded-2xl text-black">
                <FaMapMarkerAlt size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Our Location</h3>
                <p className="text-zinc-600">{settings.location}</p>
              </div>
            </div>

            <div className="flex gap-6 items-start p-6 bg-white rounded-3xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
              <div className="bg-green-500 p-4 rounded-2xl text-white">
                <FaPhone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Call Us</h3>
                <p className="text-zinc-600">Primary: {settings.phone}</p>
                <p className="text-zinc-600">Secondary: {settings.altPhone}</p>
              </div>
            </div>

            <div className="flex gap-6 items-start p-6 bg-white rounded-3xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
              <div className="bg-black p-4 rounded-2xl text-yellow-500">
                <FaClock size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Opening Hours</h3>
                <p className="text-zinc-600">{settings.openHours}</p>
              </div>
            </div>

            <div className="flex gap-6 items-start p-6 bg-white rounded-3xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
              <div className="bg-blue-500 p-4 rounded-2xl text-white">
                <FaEnvelope size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Email Us</h3>
                <p className="text-zinc-600">{settings.email}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-zinc-100">
            <h2 className="text-3xl font-bold text-zinc-900 mb-8">Send a Message</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2 uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+256..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2 uppercase tracking-wider">Your Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell us what you're craving..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                Send Message
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-zinc-100">
              <p className="text-center text-zinc-500 mb-6 font-medium">Or reach us instantly via</p>
              <a
                href={`https://wa.me/${settings.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-green-50 text-green-600 py-4 rounded-2xl font-bold border-2 border-green-100 hover:bg-green-100 transition-all"
              >
                <FaWhatsapp size={24} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
