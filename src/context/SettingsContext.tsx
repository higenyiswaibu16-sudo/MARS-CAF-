import { createContext, useContext, useState, useEffect } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { convexQuery } from '@convex-dev/react-query';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Doc, Id } from '../../convex/_generated/dataModel';

export type RestaurantSettings = Doc<"settings">;
export type GalleryItem = Doc<"gallery">;

interface SettingsContextType {
  settings: RestaurantSettings;
  gallery: GalleryItem[];
  updateSettings: (newSettings: Partial<RestaurantSettings>) => void;
  addToGallery: (imageUrls: string[]) => void;
  removeFromGallery: (id: Id<"gallery">) => void;
  logo: string | null;
  updateLogo: (base64: string | null) => void;
}

const defaultSettings: any = {
  name: "Mars Cafe Gardens",
  phone: "+256 709 737 688",
  altPhone: "+256 700 000 000",
  email: "info@marscafegardens.com",
  location: "Kyengera, Masaka Road, Kampala, Uganda",
  openHours: "Open 24 Hours, 7 Days a week",
  galleryTitle: "Our Atmosphere",
  gallerySubtitle: "The Experience",
  themeColor: "#22c55e",
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: settingsData } = useSuspenseQuery(convexQuery(api.settings.getSettings, {}));
  const { data: gallery } = useSuspenseQuery(convexQuery(api.gallery.getGallery, {}));

  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLogo = localStorage.getItem('cafeLogo');
      if (savedLogo) setLogo(savedLogo);
    }
  }, []);

  const updateLogo = (base64: string | null) => {
    setLogo(base64);
    if (typeof window !== 'undefined') {
      if (base64) {
        localStorage.setItem('cafeLogo', base64);
      } else {
        localStorage.removeItem('cafeLogo');
      }
    }
  };

  const update = useMutation(api.settings.updateSettings);
  const addImages = useMutation(api.gallery.addToGallery);
  const delImage = useMutation(api.gallery.removeFromGallery);

  const settings = settingsData || { ...defaultSettings, _id: 'temp' as any, _creationTime: 0 };

  const updateSettings = (newSettings: any) => {
    update(newSettings);
  };

  const addToGallery = (images: string[]) => {
    addImages({ images });
  };

  const removeFromGallery = (id: Id<"gallery">) => {
    delImage({ id });
  };

  return (
    <SettingsContext.Provider value={{ settings, gallery, updateSettings, addToGallery, removeFromGallery, logo, updateLogo }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
