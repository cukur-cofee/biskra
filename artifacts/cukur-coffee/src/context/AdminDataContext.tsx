import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchAdminData, defaultAdminData, type AdminData } from "@/lib/jsonbin";

interface AdminDataContextType extends AdminData {
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const AdminDataContext = createContext<AdminDataContextType>({
  ...defaultAdminData,
  isLoading: false,
  refresh: async () => {},
});

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AdminData>(defaultAdminData);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    const fetched = await fetchAdminData();
    setData(fetched);
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <AdminDataContext.Provider value={{ ...data, isLoading, refresh: load }}>
      {children}
    </AdminDataContext.Provider>
  );
}

export const useAdminData = () => useContext(AdminDataContext);
