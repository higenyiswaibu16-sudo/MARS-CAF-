import { createContext, useContext, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { convexQuery } from '@convex-dev/react-query';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Doc, Id } from '../../convex/_generated/dataModel';

export type MenuItem = Doc<"menuItems">;

interface MenuContextType {
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, '_id' | '_creationTime'>) => void;
  updateMenuItem: (id: Id<"menuItems">, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: Id<"menuItems">) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: menuItems } = useSuspenseQuery(convexQuery(api.menu.getMenuItems, {}));
  const [isAdmin, setIsAdmin] = useState(false);

  const add = useMutation(api.menu.addMenuItem);
  const update = useMutation(api.menu.updateMenuItem);
  const del = useMutation(api.menu.deleteMenuItem);

  const addMenuItem = (item: any) => {
    add(item);
  };

  const updateMenuItem = (id: Id<"menuItems">, updatedFields: any) => {
    update({ id, ...updatedFields });
  };

  const deleteMenuItem = (id: Id<"menuItems">) => {
    del({ id });
  };

  return (
    <MenuContext.Provider value={{ menuItems, addMenuItem, updateMenuItem, deleteMenuItem, isAdmin, setIsAdmin }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within a MenuProvider');
  return context;
};
