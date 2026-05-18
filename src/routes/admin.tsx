import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMenu } from '~/context/MenuContext'
import { useSettings } from '~/context/SettingsContext'
import { useState, useEffect, useRef } from 'react'
import { FaPlus, FaArrowLeft, FaSave, FaCamera, FaImage, FaTimes, FaCog, FaUtensils, FaPhotoVideo, FaPalette } from 'react-icons/fa'
import type { Id } from '../../convex/_generated/dataModel'

export const Route = createFileRoute('/admin')({
  head: () => ({ meta: [{ title: 'Owner Panel - Mars Cafe Gardens' }] }),
  component: AdminPanel,
})

// Helper to convert File to Base64 and compress slightly
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = reader.result as string
      // Basic check for size (5MB limit for localStorage usually)
      if (base64.length > 1024 * 1024 * 1.5) {
        alert('Warning: This image is very large. Persistence might fail if you add many large images.')
      }
      resolve(base64)
    }
    reader.onerror = error => reject(error)
  })
}

const THEME_OPTIONS = [
  { name: 'Emerald Green', color: '#22c55e' },
  { name: 'Sunset Gold', color: '#eab308' },
  { name: 'Royal Red', color: '#ef4444' },
  { name: 'Midnight Blue', color: '#3b82f6' },
  { name: 'Pure White', color: '#ffffff' },
  { name: 'Warm Orange', color: '#f97316' },
]

function AdminPanel() {
  const { isAdmin, addMenuItem, menuItems, deleteMenuItem } = useMenu()
  const { settings, updateSettings, gallery, addToGallery, removeFromGallery, logo, updateLogo } = useSettings()
  const navigate = useNavigate()
  
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const placeCameraRef = useRef<HTMLInputElement>(null)
  const placeGalleryRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  
  const [activeTab, setActiveTab] = useState<'menu' | 'settings' | 'gallery'>('menu')
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Breakfast',
    description: '',
    isBestSeller: false
  })
  
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [settingsForm, setSettingsForm] = useState({ ...settings })

  // Security: Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate({ to: '/' })
    }
  }, [isAdmin, navigate])

  // Sync settings form when settings context updates or tab changes
  useEffect(() => {
    if (settings) {
      setSettingsForm({ ...settings })
    }
  }, [settings, activeTab])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const base64 = await fileToBase64(file)
        setImagePreview(base64)
      } catch (err) {
        console.error('Error processing image', err)
      }
    }
  }

  const handlePlaceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const base64s: string[] = []
      for (let i = 0; i < files.length; i++) {
        try {
          const b64 = await fileToBase64(files[i])
          base64s.push(b64)
        } catch (err) {
          console.error('Error processing gallery image', err)
        }
      }
      addToGallery(base64s)
      if (e.target) e.target.value = ''
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    if (cameraInputRef.current) cameraInputRef.current.value = ''
    if (galleryInputRef.current) galleryInputRef.current.value = ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.price || !imagePreview) {
      alert('Please fill in all required fields and provide an image')
      return
    }

    addMenuItem({
      name: formData.name,
      price: Number(formData.price),
      category: formData.category,
      description: formData.description,
      image: imagePreview,
      isBestSeller: formData.isBestSeller
    })

    alert('Dish added successfully!')
    setFormData({
      name: '',
      price: '',
      category: 'Breakfast',
      description: '',
      isBestSeller: false
    })
    setImagePreview(null)
  }

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { _id, _creationTime, ...fields } = settingsForm as any
    updateSettings(fields)
    alert('Restaurant settings updated!')
  }

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const base64 = await fileToBase64(file)
        setLogoPreview(base64)
      } catch (err) {
        console.error('Error processing logo', err)
      }
    }
  }

  const handleSaveLogo = () => {
    if (logoPreview) {
      updateLogo(logoPreview)
      alert('Logo updated successfully!')
      setLogoPreview(null)
    }
  }

  const handleRemoveLogo = () => {
    if (window.confirm('Are you sure you want to remove the logo?')) {
      updateLogo(null)
      setLogoPreview(null)
    }
  }

  if (!isAdmin) return null

  return (
    <div className="bg-zinc-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate({ to: '/menu' })}
              className="p-3 bg-white rounded-full shadow-sm border border-zinc-100 hover:text-green-600 transition-colors"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-3xl font-bold text-zinc-900">Owner <span style={{ color: settings.themeColor }}>Panel</span></h1>
          </div>
          
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
            <button 
              onClick={() => setActiveTab('menu')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'menu' ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-500 hover:bg-zinc-50'}`}
            >
              <FaUtensils /> Menu
            </button>
            <button 
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'gallery' ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-500 hover:bg-zinc-50'}`}
            >
              <FaImage /> Ambience
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'settings' ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-500 hover:bg-zinc-50'}`}
            >
              <FaCog /> Settings
            </button>
          </div>

          <div className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold animate-pulse">
            ADMIN MODE
          </div>
        </div>

        {activeTab === 'menu' && (
          <>
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-zinc-100 mb-12">
              <h2 className="text-2xl font-bold text-zinc-900 mb-8 flex items-center gap-3">
                <span className="flex items-center" style={{ color: settings.themeColor }}><FaPlus /></span> Add New Dish
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-zinc-700 uppercase tracking-wider">Dish Image*</label>
                  {!imagePreview ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="border-2 border-dashed border-zinc-200 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 hover:border-green-500 hover:bg-green-50 transition-all group"
                      >
                        <div className="bg-zinc-100 p-5 rounded-full text-zinc-400 group-hover:bg-green-100 group-hover:text-green-600 transition-all">
                          <FaCamera size={24} />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-zinc-700">Take Photo</p>
                          <p className="text-xs text-zinc-400">Use Device Camera</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="border-2 border-dashed border-zinc-200 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 hover:border-yellow-500 hover:bg-yellow-50 transition-all group"
                      >
                        <div className="bg-zinc-100 p-5 rounded-full text-zinc-400 group-hover:bg-yellow-100 group-hover:text-yellow-600 transition-all">
                          <FaPhotoVideo size={24} />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-zinc-700">Upload from Gallery</p>
                          <p className="text-xs text-zinc-400">Choose from Device</p>
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div className="relative rounded-[2rem] overflow-hidden group aspect-video md:aspect-auto md:h-64 border border-zinc-100 shadow-inner bg-zinc-50">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button type="button" onClick={() => cameraInputRef.current?.click()} className="bg-white text-black p-4 rounded-full shadow-lg hover:scale-110" title="Retake Photo">
                          <FaCamera size={20} />
                        </button>
                        <button type="button" onClick={() => galleryInputRef.current?.click()} className="bg-white text-black p-4 rounded-full shadow-lg hover:scale-110" title="Change from Gallery">
                          <FaPhotoVideo size={20} />
                        </button>
                        <button type="button" onClick={handleRemoveImage} className="bg-red-500 text-white p-4 rounded-full shadow-lg hover:scale-110" title="Remove Image">
                          <FaTimes size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                  <input type="file" ref={cameraInputRef} onChange={handleFileChange} accept="image/*" capture="environment" className="hidden" />
                  <input type="file" ref={galleryInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-zinc-700 uppercase tracking-wider">Dish Name*</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Grilled Chicken" className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-zinc-700 uppercase tracking-wider">Price (UGX)*</label>
                    <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="e.g. 25000" className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-zinc-700 uppercase tracking-wider">Category*</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all appearance-none cursor-pointer text-zinc-700">
                    <option>Breakfast</option>
                    <option>Local Dishes</option>
                    <option>Fast Food</option>
                    <option>Beverages</option>
                    <option>Snacks</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-zinc-700 uppercase tracking-wider">Description</label>
                  <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Briefly describe the dish..." className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all"></textarea>
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" id="bestSeller" checked={formData.isBestSeller} onChange={(e) => setFormData({...formData, isBestSeller: e.target.checked})} className="w-5 h-5 accent-zinc-600 rounded cursor-pointer" />
                  <label htmlFor="bestSeller" className="text-zinc-700 font-bold cursor-pointer">Mark as Best Seller</label>
                </div>

                <button type="submit" className="w-full text-white py-5 rounded-2xl font-bold text-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 active:scale-[0.98]" style={{ backgroundColor: settings.themeColor }}>
                  <FaSave /> Save New Dish
                </button>
              </form>
            </div>

            <div className="mt-12">
              <h3 className="text-xl font-bold text-zinc-900 mb-6">Current Menu Items ({menuItems.length})</h3>
              <div className="bg-white rounded-[2rem] overflow-hidden border border-zinc-100 shadow-sm overflow-x-auto">
                 <table className="w-full text-left min-w-[500px]">
                   <thead className="bg-zinc-50 border-b border-zinc-100">
                     <tr>
                       <th className="px-6 py-4 font-bold text-zinc-700 text-sm">Image</th>
                       <th className="px-6 py-4 font-bold text-zinc-700 text-sm">Item</th>
                       <th className="px-6 py-4 font-bold text-zinc-700 text-sm">Category</th>
                       <th className="px-6 py-4 font-bold text-zinc-700 text-sm">Price</th>
                       <th className="px-6 py-4 font-bold text-zinc-700 text-sm">Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-zinc-100">
                     {menuItems.map(item => (
                       <tr key={item._id} className="hover:bg-zinc-50 transition-colors">
                         <td className="px-6 py-4">
                           <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                         </td>
                         <td className="px-6 py-4 font-medium">{item.name}</td>
                         <td className="px-6 py-4 text-zinc-500 text-sm">
                           <span className="px-3 py-1 bg-zinc-100 rounded-full text-xs font-bold uppercase tracking-wider">
                             {item.category}
                           </span>
                         </td>
                         <td className="px-6 py-4 font-bold text-green-600">UGX {item.price.toLocaleString()}</td>
                         <td className="px-6 py-4">
                            <button 
                                onClick={() => {
                                  if (window.confirm('Delete this item?')) {
                                    deleteMenuItem(item._id as Id<"menuItems">)
                                  }
                                }}
                                className="text-red-500 hover:text-red-700 transition-colors"
                            >
                                <FaTimes />
                            </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-zinc-100">
              <h2 className="text-2xl font-bold text-zinc-900 mb-8 flex items-center gap-3">
                <span className="flex items-center" style={{ color: settings.themeColor }}><FaImage /></span> Ambience Gallery
              </h2>
              <p className="text-zinc-500 mb-8">Add pictures of the restaurant, its surroundings, and the atmosphere.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                <button
                  type="button"
                  onClick={() => placeCameraRef.current?.click()}
                  className="border-2 border-dashed border-zinc-200 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 hover:border-green-500 hover:bg-green-50 transition-all group"
                >
                  <div className="bg-zinc-100 p-5 rounded-full text-zinc-400 group-hover:bg-green-100 group-hover:text-green-600 transition-all">
                    <FaCamera size={24} />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-zinc-700">Snap Place</p>
                    <p className="text-xs text-zinc-400">Use Camera</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => placeGalleryRef.current?.click()}
                  className="border-2 border-dashed border-zinc-200 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 hover:border-yellow-500 hover:bg-yellow-50 transition-all group"
                >
                  <div className="bg-zinc-100 p-5 rounded-full text-zinc-400 group-hover:bg-yellow-100 group-hover:text-yellow-600 transition-all">
                    <FaPhotoVideo size={24} />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-zinc-700">Add from Gallery</p>
                    <p className="text-xs text-zinc-400">Upload multiple</p>
                  </div>
                </button>
              </div>

              <input type="file" ref={placeCameraRef} onChange={handlePlaceImageUpload} accept="image/*" capture="environment" className="hidden" />
              <input type="file" ref={placeGalleryRef} onChange={handlePlaceImageUpload} accept="image/*" multiple className="hidden" />

              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-zinc-900">Manage Photos ({gallery.length})</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((item) => (
                  <div key={item._id} className="relative aspect-square rounded-2xl overflow-hidden group border border-zinc-100 shadow-sm">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to remove this image from the gallery?')) {
                          removeFromGallery(item._id as Id<"gallery">)
                        }
                      }}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2.5 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all shadow-lg hover:scale-110 active:scale-95 z-30"
                      title="Remove Image"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-zinc-100">
              <h2 className="text-2xl font-bold text-zinc-900 mb-8 flex items-center gap-3">
                <span className="flex items-center" style={{ color: settings.themeColor }}><FaCog /></span> Gallery Text Settings
              </h2>
              <form onSubmit={handleSettingsSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-zinc-700 uppercase tracking-wider">Section Title</label>
                  <input 
                    type="text" 
                    value={settingsForm.galleryTitle} 
                    onChange={(e) => setSettingsForm({...settingsForm, galleryTitle: e.target.value})} 
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 transition-all" 
                    style={{ borderColor: settings.themeColor }}
                    placeholder="e.g. Our Atmosphere"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-zinc-700 uppercase tracking-wider">Section Subtitle</label>
                  <input 
                    type="text" 
                    value={settingsForm.gallerySubtitle} 
                    onChange={(e) => setSettingsForm({...settingsForm, gallerySubtitle: e.target.value})} 
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 transition-all" 
                    style={{ borderColor: settings.themeColor }}
                    placeholder="e.g. The Experience"
                  />
                </div>
                <button type="submit" className="w-full bg-zinc-900 text-white py-5 rounded-2xl font-bold text-xl hover:bg-black transition-all shadow-lg flex items-center justify-center gap-3">
                  <FaSave /> Save Gallery Settings
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-zinc-100 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-8 flex items-center gap-3">
                <span className="flex items-center" style={{ color: settings.themeColor }}><FaCog /></span> Restaurant Info
              </h2>

              <form onSubmit={handleSettingsSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-zinc-700 uppercase tracking-wider">Restaurant Name</label>
                  <input type="text" value={settingsForm.name} onChange={(e) => setSettingsForm({...settingsForm, name: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 transition-all" style={{ borderColor: settings.themeColor }} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-zinc-700 uppercase tracking-wider">Primary Phone</label>
                    <input type="text" value={settingsForm.phone} onChange={(e) => setSettingsForm({...settingsForm, phone: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 transition-all" style={{ borderColor: settings.themeColor }} />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-zinc-700 uppercase tracking-wider">Secondary Phone</label>
                    <input type="text" value={settingsForm.altPhone} onChange={(e) => setSettingsForm({...settingsForm, altPhone: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 transition-all" style={{ borderColor: settings.themeColor }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-zinc-700 uppercase tracking-wider">Email Address</label>
                  <input type="email" value={settingsForm.email} onChange={(e) => setSettingsForm({...settingsForm, email: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 transition-all" style={{ borderColor: settings.themeColor }} />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-zinc-700 uppercase tracking-wider">Location</label>
                  <input type="text" value={settingsForm.location} onChange={(e) => setSettingsForm({...settingsForm, location: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 transition-all" style={{ borderColor: settings.themeColor }} />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-zinc-700 uppercase tracking-wider">Opening Hours</label>
                  <input type="text" value={settingsForm.openHours} onChange={(e) => setSettingsForm({...settingsForm, openHours: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 transition-all" style={{ borderColor: settings.themeColor }} />
                </div>

                <button type="submit" className="w-full bg-black text-white py-5 rounded-2xl font-bold text-xl hover:bg-zinc-800 transition-all shadow-lg flex items-center justify-center gap-3">
                  <FaSave /> Update Basic Info
                </button>
              </form>
            </div>

            <div className="border-t border-zinc-100 pt-12">
              <h2 className="text-2xl font-bold text-zinc-900 mb-8 flex items-center gap-3">
                <span className="flex items-center" style={{ color: settings.themeColor }}><FaCamera /></span> Logo Management
              </h2>
              
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-shrink-0">
                    <p className="text-sm font-bold text-zinc-700 uppercase tracking-wider mb-4">Current Logo</p>
                    {logo ? (
                      <div className="relative group">
                        <img src={logo} alt="Current Logo" className="w-32 h-32 object-contain bg-zinc-50 border border-zinc-200 rounded-2xl" />
                        <button onClick={handleRemoveLogo} className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-all">
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl flex items-center justify-center text-zinc-300">
                        No Logo
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-4">
                    <p className="text-sm font-bold text-zinc-700 uppercase tracking-wider mb-4">Upload New Logo</p>
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => logoInputRef.current?.click()}
                        className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
                      >
                        <FaPhotoVideo /> Select Logo
                      </button>
                      <input type="file" ref={logoInputRef} onChange={handleLogoFileChange} accept="image/*" className="hidden" />
                      
                      {logoPreview && (
                        <button
                          onClick={handleSaveLogo}
                          className="text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all"
                          style={{ backgroundColor: settings.themeColor }}
                        >
                          <FaSave /> Save Logo
                        </button>
                      )}
                    </div>
                    
                    {logoPreview && (
                      <div className="mt-4">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Preview</p>
                        <img src={logoPreview} alt="Preview" className="h-20 object-contain bg-zinc-50 border border-zinc-200 rounded-lg p-2" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-12">
              <h2 className="text-2xl font-bold text-zinc-900 mb-8 flex items-center gap-3">
                <span className="flex items-center" style={{ color: settings.themeColor }}><FaPalette /></span> Branding & Theme
              </h2>
              
              <div className="space-y-4">
                <label className="block text-sm font-bold text-zinc-700 uppercase tracking-wider text-center md:text-left">Highlight Color</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {THEME_OPTIONS.map(opt => (
                    <button
                      key={opt.color}
                      onClick={() => updateSettings({ themeColor: opt.color })}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${settings.themeColor === opt.color ? 'border-zinc-900 bg-zinc-900 text-white scale-105 shadow-md' : 'border-zinc-100 bg-white hover:border-zinc-200'}`}
                    >
                      <div className="w-8 h-8 rounded-full border border-white/20 shadow-inner" style={{ backgroundColor: opt.color }}></div>
                      <span className="text-[10px] font-black uppercase text-center">{opt.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
